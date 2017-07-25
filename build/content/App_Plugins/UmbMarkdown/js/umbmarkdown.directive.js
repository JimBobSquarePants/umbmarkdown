﻿angular.module("umbraco.directives").directive("umbMarkdown",
    function () {
        var link = function ($scope, elem) {

            var textarea = elem.find("textarea")[0];

            // There's a race condition going on here. The editor is initializing before ngBind has kicked in.
            // To workaround it we set the value to match the model value before we initialize the editor.
            // That's cleaner and less prone to error than using setTimeout. ngBind continues to work
            textarea.value = $scope.model.value;

            var simplemde = new SimpleMDE({
                promptURLs: false,
                spellChecker: false,
                autoDownloadFontAwesome: false,
                element: textarea,
                forceSync: true,
                renderingConfig: {
                    codeSyntaxHighlighting: true
                },
                toolbar: [
                    "bold", "italic", "heading", "|",
                    "quote", "code", "unordered-list", "ordered-list", "|",
                    {
                        name: "link",
                        action: SimpleMDE.prototype.drawLink,
                        className: "fa fa-link",
                        title: "Insert Link"
                    },
                    {
                        name: "image",
                        action: SimpleMDE.prototype.drawImage,
                        className: "fa fa-picture-o",
                        title: "Insert Image"
                    },
                    "table", "|", "preview", "guide"]
            });

            simplemde.codemirror.on("change", function () {
                $scope.model.value = simplemde.codemirror.getValue();
            });
        }

        return {
            restrict: "E",
            replace: true,
            scope: false,
            templateUrl: window.Umbraco.Sys.ServerVariables.umbracoSettings.appPluginsPath + "/UmbMarkdown/Views/umbmarkdown.directive.html",
            link: link
        };
    });