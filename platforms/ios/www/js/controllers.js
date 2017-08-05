var app = angular.module('starter.controllers', []);

app.controller("chatController", ["$scope", "chatService", "$timeout", function($scope, chatService, $timeout) {
    function makeid(j) {
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < j; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        }
    }

    $scope.typeMessage = function() {
        if ($scope.message) {
            $scope.messageWidth = "col-xs-10";
            $scope.hide = false;
        } else {
            $scope.messageWidth = "col-xs-12";
            $scope.hide = true;
        }
    };

    $scope.sendMessage = function() {
        console.log("Submitted");
        var encryptionKey = makeid(30);
        var addedKey = makeid(5);
        var encryptedMessage = GibberishAES.enc($scope.message, encryptionKey);
        var messageLength = GibberishAES.enc(encryptedMessage.length, addedKey);
        console.log($scope.message);
        if ($scope.message) {
            console.log("WE'RE ABOUT TO SEND");
            chatService.sendMessage(addedKey + encryptedMessage + encryptionKey, messageLength).then(function(response) {
                $scope.message = "";
            });
        }
    };

    $scope.getMessages = function() {
        $scope.messages = JSON.parse(localStorage.getItem("messages"));
        chatService.getMessages().then(function(response) {
            localStorage.setItem("messages", response);
            $scope.messages = JSON.parse(localStorage.getItem("messages"));
            console.log($scope.messages);
        });
        $timeout(function() {
            $scope.getMessages();
        }, 1000);
    };

    $scope.getMessages();

    $scope.decrypt = function(encText, decKey) {
        return GibberishAES.dec(encText, decKey);
    };


}]);
app.controller("homeController", function() {

});

app.controller("callController", function() {

});

app.controller("rantController", function(rantService, $window, $ionicModal, $scope, $ionicActionSheet, $ionicScrollDelegate, $rootScope, $window, $timeout, $ionicTabsDelegate) {
    $scope.defaultLike = "button icon ion-ios-heart-outline";
    function createArray(object) {
        var array = [];
        var ids = [];
        for (var i in object) {
            ids.push(i);
            array.push(object[i]);
        }
        return { array: array, ids: ids };
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

	
    $scope.openModal = function() {
        console.log($scope.modal);
        console.log("MODAL OPENED");
        var height = $window.innerHeight;
        $scope.rantHeight = (height - 200)/3;
        $scope.modal.rant= "";
        $scope.modal.pseudonym = "";
        $scope.modal.show();
        cordova.plugins.Keyboard.show();
    };
	
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $ionicModal.fromTemplateUrl('my-modal-private.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal2 = modal;
    });

    $scope.openModal2 = function() {
        console.log("MODAL OPENED");
        var height = $window.innerHeight;
        $scope.rantHeight = (height - 200)/3;
        $scope.modal2.rant= "";
        $scope.modal2.pseudonym = "";
        $scope.modal2.show();
        cordova.plugins.Keyboard.show();
    };
	
    $scope.closeModal2 = function() {
        $scope.modal2.hide();
    };
	
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
        $scope.modal2.remove();
    });

    function sortArray(array) {
        array.sort(function(a, b) { return (a.rant_like_id - b.rant_like_id); });
        console.log(JSON.stringify(array));
        return array;
    }

    function checkIfLiked(rants){
        console.log(rants);
        var chatId = Number(localStorage.getItem("chatId"));
        $scope.liked = [];
        for(var i=0; i<rants.length; i++){
            var likes = rants[i].likes;
            if(likes.indexOf(chatId)!=-1){
                $scope.liked[i] = "button icon ion-ios-heart liked";
            }else{
                $scope.liked[i] = "button icon ion-ios-heart-outline";
            }
        }
    }

    $scope.Height = $window.innerHeight - 30;
    $scope.getPublicRants = function() {
        $scope.publicRants = createArray(JSON.parse(localStorage.getItem("rants"))).array;
        rantService.getPublicRants().then(function(response) {
            console.log(response);
            localStorage.setItem("rants", JSON.stringify(response));
            $scope.publicRants = createArray(JSON.parse(localStorage.getItem("rants"))).array;
            checkIfLiked($scope.publicRants);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.getPrivateRants = function() {
        $scope.privateRants = createArray(JSON.parse(localStorage.getItem("privateRants"))).array;
        rantService.getPrivateRants().then(function(response) {
            console.log(response);
            localStorage.setItem("privateRants", JSON.stringify(response));
            $scope.privateRants = createArray(JSON.parse(localStorage.getItem("privateRants"))).array;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.likeRant = function(key) {
        var length = createArray(JSON.parse(localStorage.getItem("rants"))).ids.length;
        var rantId = createArray(JSON.parse(localStorage.getItem("rants"))).ids[(length - 1) - key];
        if($scope.liked[(length-1)-key] == "button icon ion-ios-heart liked"){
            rantService.unlikeRant(rantId).then(function(response){
                $scope.getRantsLikedByUser();
                $scope.liked[(length-1)-key] = "button icon ion-ios-heart-outline";
            });
        }
        else{
            rantService.likeRant(rantId).then(function(response) {
                $scope.getRantsLikedByUser();
                $scope.liked[(length-1)-key] = "button icon ion-ios-heart liked";
            });
        }
    };

    $scope.unlikeRant = function(key) {
        var length = createArray(JSON.parse(localStorage.getItem("likedRants"))).ids.length;
        var rantId = createArray(JSON.parse(localStorage.getItem("likedRants"))).ids[key];
        console.log(rantId);
        rantService.unlikeRant(rantId).then(function(response){ 
            $scope.getRantsLikedByUser();
        });
    }

    $scope.deleteRant = function(key){
        var length = createArray(JSON.parse(localStorage.getItem("privateRants"))).ids.length;
        var rantId = createArray(JSON.parse(localStorage.getItem("privateRants"))).ids[(length - 1) - key];
        console.log(rantId);
        console.log(key);
        rantService.deleteRant(rantId).then(function(response){
            console.log("RANT DELETED");
            $scope.getPrivateRants();
        });
    }

    $scope.openRant = function(rant, key, source) {
        console.log(key);
        console.log(source);
        var length = createArray(JSON.parse(localStorage.getItem(source))).ids.length;
        console.log(length);
        if (source == 'likedRants') {
            $rootScope.singleRantId = createArray(JSON.parse(localStorage.getItem(source))).ids[key];
        } else {
            $rootScope.singleRantId = createArray(JSON.parse(localStorage.getItem(source))).ids[(length - 1) - key];
            
        }

        console.log($rootScope.singleRantId);
        $rootScope.singleRant = rant;
        console.log(JSON.stringify(rant));
        window.location = "#/tab/dash-single";
    };

    $scope.showActionsheet = function(index) {
        var rantIndex= index;
        $ionicActionSheet.show({
            titleText: 'Delete Rant',
            
            destructiveText: 'Delete',
            cancelText: 'Cancel',
            cancel: function() {
                console.log('CANCELLED');
            },
            destructiveButtonClicked: function() {
                console.log('DESTRUCT');
                $scope.deleteRant(rantIndex);
                return true;
            }
        });
  };

    $scope.reloadOnReply = function(rant, key) {
        if ($rootScope.singleRantId) {
            var rantId = $rootScope.singleRantId;
            rantService.getSingleRant(rantId).then(function(response) {
                console.log(JSON.stringify(createArray(response).array));
                $rootScope.singleRant = createArray(response).array[0];
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
    };

    $scope.replyRant = function(replyContent) {
        var rantId = $rootScope.singleRantId;
        rantService.replyRant(rantId, replyContent).then(function(response) {
            console.log("HERREEE");
            $scope.replyContent = "";
            $scope.reloadOnReply();
        });
    };

    $scope.getRantsLikedByUser = function() {
        $scope.likedRants = sortArray(createArray(JSON.parse(localStorage.getItem("likedRants"))).array);
        rantService.getRantsLikedByUser().then(function(response) {
            localStorage.setItem("likedRants", JSON.stringify(response));
            console.log(localStorage.getItem("likedRants"));
            $scope.likedRants = sortArray(createArray(JSON.parse(localStorage.getItem("likedRants"))).array);
            console.log($scope.likedRants);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    

    $scope.getPublicRants();
    $scope.getPrivateRants();
    $scope.getRantsLikedByUser();
    $scope.postRant = function(rantContent, pseudonym) {
        console.log("RANT POSTED");
        console.log($scope.rant);
        rantService.postRant(rantContent, pseudonym).then(function(response) {
            console.log(response.data);
            if (response.data.err != 1) {
                $scope.modal.rant = "";
                $scope.getPublicRants();
                $scope.closeModal();
            }
        });
    };
    $scope.postPrivateRant = function(rantContent, pseudonym) {
        rantService.postPrivateRant(rantContent, pseudonym).then(function(response) {
            console.log(response.data);
            if (response.data.err != 1) {
                $scope.modal2.rant = "";
                $scope.getPrivateRants();
                $scope.closeModal2();
            }
        });
    };
});

app.controller("searchController", function($scope, searchService, $rootScope){
    function createArray(object) {
        var array = [];
        var ids = [];
        for (var i in object) {
            ids.push(i);
            array.push(object[i]);
        }
        return { array: array, ids: ids };
    }
    $scope.searchRant= function(query){
        if(query.length >= 3){
            $scope.showIcon = false;
            searchService.searchRant(query).then(function(response){
                console.log(response);
                $scope.searchResponse = createArray(response).array;
            });
        }
        else{
            $scope.searchResponse = [];
        }
    }

});