var app = angular.module('starter.services', [])

app.service("chatService", function($http, $q) {

    this.sendMessage = function(message, messageLength) {
        data = { message: message, messageLength: messageLength };
        var deferred = $q.defer();
        console.log("MESSAGE SENT");
        $http.post("https://asp-ng.herokuapp.com/counsel/sendMessage", data).then(function(response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    };

    this.getMessages = function() {
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/counsel/getMessages").then(function(response) {
            deferred.resolve(JSON.stringify(response.data.res));
            console.log(JSON.stringify(response.data));
        });
        return deferred.promise;
    };

});

app.service("rantService", function($http, $q) {
    this.getPublicRants = function() {
        var deferred = $q.defer();
        $http.get("https://asp-ng.herokuapp.com/rant/getPublicRants").then(function(response) {
            deferred.resolve(response.data.res);
        });
        return deferred.promise;
    };
    this.getPrivateRants = function() {
        var deferred = $q.defer();
        $http.get("https://asp-ng.herokuapp.com/rant/getPublicRants?rantType=1").then(function(response) {
            deferred.resolve(response.data.res);
        });
        return deferred.promise;
    };
    this.getRantsLikedByUser = function() {
        var deferred = $q.defer();
        $http.get("https://asp-ng.herokuapp.com/rant/getRantsLikedByUser").then(function(response) {
            console.log(JSON.stringify(response.data.res));
            deferred.resolve(response.data.res);
        });
        return deferred.promise;
    };
    this.likeRant = function(rantId) {
        var deferred = $q.defer();
        data = { rantId: rantId };
        $http.post("https://asp-ng.herokuapp.com/rant/likeRant", data).then(function(response) {
            console.log(response);
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };
    this.unlikeRant = function(rantId) {
        var deferred = $q.defer();
        data = { rantId: rantId };
        $http.post("https://asp-ng.herokuapp.com/rant/unlikeRant", data).then(function(response) {
            console.log(response);
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }
    this.replyRant = function(rantId, replyContent) {
        console.log(rantId);
        var deferred = $q.defer();
        data = {
            rantId: rantId,
            replyContent: replyContent
        };
        $http.post("https://asp-ng.herokuapp.com/rant/replyRant", data).then(function(response) {
            console.log(JSON.stringify(response));
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };
    this.postRant = function(rantContent, pseudonym) {
        var data = {
            rantContent: rantContent,
            pseudonym: pseudonym || "",
        };
        console.log(data);
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/rant/postRant", data).then(function(response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    };
    this.postPrivateRant = function(rantContent, pseudonym) {
        var data = {
            rantContent: rantContent,
            rantType: 1,
            pseudonym: pseudonym || "",
        };
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/rant/postRant", data).then(function(response) {
            deferred.resolve(response);
        });
        return deferred.promise;
    };
    this.deleteRant = function(rantId){
        var data = {
            rantId: rantId
        }
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/rant/deleteRant", data).then(function(response){
            deferred.resolve(response);
        });
        return deferred.promise;
    };
    this.getSingleRant = function(rantId) {
        var data = {
            rantId: rantId
        };
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/rant/getSingleRant", data).then(function(response) {
            deferred.resolve(response.data.res);
        });
        return deferred.promise;
    };
});

app.service("searchService", function($q, $http){
    this.searchRant = function(query){
        var data={
            query: query
        }
        var deferred = $q.defer();
        $http.post("https://asp-ng.herokuapp.com/rant/searchRant", data).then(function(response){
            deferred.resolve(response.data.res);
        });
        return deferred.promise;
    }
});