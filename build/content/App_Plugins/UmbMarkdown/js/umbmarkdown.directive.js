angular.module("umbraco.directives").directive("umbMarkdown",
    function () {
        var featureTest = function (property, value, noPrefixes) {
            // Thanks Modernizr! https://github.com/phistuck/Modernizr/commit/3fb7217f5f8274e2f11fe6cfeda7cfaf9948a1f5
            var prop = property + ":",
                el = document.createElement("test"),
                mStyle = el.style;

            if (!noPrefixes) {
                mStyle.cssText = prop + ["-webkit-", "-moz-", "-ms-", "-o-", ""].join(value + ";" + prop) + value + ";";
            } else {
                mStyle.cssText = prop + value;
            }
            return mStyle[property].indexOf(value) !== -1;
        };

        var link = function ($scope, elem) {

            var textarea = elem.find("textarea")[0],
                supportsSticky = featureTest("position", "sticky");

            // Handle browsers that don't support position:sticky so that our toolbar is in the correct place.
            if (!supportsSticky) {
                textarea.className += " nostick";
            }

            // The Umbraco grid adds a second toolbar to the top of the section
            if (supportsSticky && document.querySelectorAll(".-umb-sticky-bar").length) {
                textarea.className += " bufferstick";
            }

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
                insertTexts: {
                    image: ["![#alt#](", "#url#)"],
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