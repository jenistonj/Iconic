﻿angular.module("umbraco").controller("Koben.Iconic.Prevalues.Packages", ['$scope', '$http', 'assetsService', function ($scope, $http, assetsService) {

    $scope.newItem = {
        alias: "",
        name: "",
        selector: "",
        extraClasses: "",
        cssfile: "",
        extractedStyles: []
    }

    $scope.currentItem;
    $scope.analysing = "init";
    $scope.newItemFormErrors = [];

    $scope.addNewItem = function () {

        $scope.analysing = "busy";

        if (!angular.isArray($scope.model.value)) $scope.model.value = [];
        $scope.newItemFormErrors = []; //remove errors

        if (!$scope.newItem.name) $scope.newItemFormErrors.name = true;
        if (!$scope.newItem.selector) $scope.newItemFormErrors.selector = true;
        if (!$scope.newItem.cssfile) $scope.newItemFormErrors.cssfile = true;

        if (Object.keys($scope.newItemFormErrors).length > 0) return;

        extractStyles($scope.newItem, function () {
            $scope.newItem.alias = uuid();
            $scope.model.value.push(angular.copy($scope.newItem));
            $scope.newItem = {};
            $scope.analysing = "success";
        }, function () {
            $scope.newItemFormErrors.selector = true;
            $scope.newItemFormErrors.cssfile = true;
            $scope.analysing = "error";
        });                                  

    }


$scope.selectItem = function (item) {
    if ($scope.currentItem === item)
        $scope.currentItem = null;
    else
        $scope.currentItem = item;
}

$scope.removeItem = function (index) {
    $scope.model.value.splice(index, 1);
}

$scope.hideItemForm = function () {
    $scope.showNewItemForm = false;
}


function extractStyles(item, successCallback, errorCallback) {

    if (!item.selector || item.selector.length <= 0) {
        errorCallback();
    }

    $http.get(item.cssfile).success(function (data) {
        item.extractedStyles = [];
        var pattern = new RegExp(item.selector, 'g');

        var match = pattern.exec(data);
        while (match !== null) {
            item.extractedStyles.push(match[1])
            match = pattern.exec(data);
        }

        if (item.extractedStyles.length > 0) {
            successCallback();
        } else {
            errorCallback();

        }

    }).error(function (response) {
        errorCallback();
    })

}

function uuid() {
    var uuid = "", i, random;
    for (i = 0; i < 32; i++) {
        random = Math.random() * 16 | 0;

        if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
        }
        uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
    }
    return uuid;
}

    //$scope.model.value = [{
    //    alias: 'glyphicons',
    //    name: 'Glyphicons',
    //    selector: '\\.(glyphicon-[\\w-]+):before{',
    //    extraClasses: 'glyphicon',
    //    cssfile: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'
    //}, {
    //    alias: 'fa',
    //    name: 'Font Awesome',
    //    selector: '\\.(fa-[\\w-]+):before{',
    //    extraClasses: 'fa',
    //    cssfile: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    //},
    //{
    //    alias: 'fi',
    //    name: 'Foundation Icons',
    //    selector: '\\.(fi-[\\w-]+):before{',
    //    extraClasses: '',
    //    cssfile: 'https://cdn.jsdelivr.net/foundation-icons/3.0/foundation-icons.min.css'
    //}];


}]);