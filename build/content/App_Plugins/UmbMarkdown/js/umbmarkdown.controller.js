angular.module("umbraco").controller("UmbMarkdown.MarkdownEditorController",
    function ($scope) {

        // This is copied directly from the SME source since the method is not publicly exposed
        // https://github.com/sparksuite/simplemde-markdown-editor/blob/6abda7ab68cc20f4aca870eb243747951b90ab04/src/js/simplemde.js#L791
        var replaceSelection = function (cm, active, startEnd, url) {
            if (/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
                return;

            var text;
            var start = startEnd[0];
            var end = startEnd[1];
            var startPoint = cm.getCursor("start");
            var endPoint = cm.getCursor("end");
            if (url) {
                // 1: Added to original
                start = start.replace("#url#", url); // 1
                end = end.replace("#url#", url);
            }
            if (active) {
                text = cm.getLine(startPoint.line);
                start = text.slice(0, startPoint.ch);
                end = text.slice(startPoint.ch);
                cm.replaceRange(start + end, {
                    line: startPoint.line,
                    ch: 0
                });
            } else {
                text = cm.getSelection();
                cm.replaceSelection(start + text + end);

                startPoint.ch += start.length;
                if (startPoint !== endPoint) {
                    endPoint.ch += start.length;
                }
            }
            cm.setSelection(startPoint, endPoint);
            cm.focus();
        };

        var openMediaPicker = function (callback) {

            $scope.mediaPickerOverlay = {};
            $scope.mediaPickerOverlay.view = "mediaPicker";
            $scope.mediaPickerOverlay.show = true;
            $scope.mediaPickerOverlay.disableFolderSelect = true;

            $scope.mediaPickerOverlay.submit = function (model) {
                var selectedImagePath = model.selectedImages[0].image;
                callback(selectedImagePath);

                $scope.mediaPickerOverlay.show = false;
                $scope.mediaPickerOverlay = null;
            };

            $scope.mediaPickerOverlay.close = function () {
                if ($scope.mediaPickerOverlay) {
                    $scope.mediaPickerOverlay.show = false;
                    $scope.mediaPickerOverlay = null;
                }
            };
        };

        var openLinkPicker = function (callback) {

            $scope.linkPickerOverlay = {};
            $scope.linkPickerOverlay.view = "linkpicker";
            $scope.linkPickerOverlay.show = true;

            $scope.linkPickerOverlay.submit = function (model) {

                $scope.linkPickerOverlay.show = false;
                $scope.linkPickerOverlay = null;

                var target = model.target,
                    href = target.url,
                    name = target.name,
                    external = target.target;

                // We want to use the Udi. If it is set, we use it, else fallback to id, and finally to null
                var hasUdi = target.udi ? true : false;
                var id = hasUdi ? target.udi : (target.id ? target.id : null);

                //if we have an id, it must be a locallink:id, as long as the isMedia flag is not set
                if (id && (window.angular.isUndefined(target.isMedia) || !target.isMedia)) {
                    href = "/{localLink:" + id + "}";
                    callback(href, name, external);
                    return;
                }

                // Is email and not //user@domain.com
                if (href.indexOf('@') > 0 && href.indexOf('//') === -1 && href.indexOf('mailto:') === -1) {
                    href = 'mailto:' + href;
                    callback(href, name, external);
                    return;
                }

                // Is www. prefixed
                if (/^\s*www\./i.test(href)) {
                    href = 'http://' + href;

                    callback(href, name, external);
                    return;
                }

                callback(href, name, external);
            };

            $scope.linkPickerOverlay.close = function () {
                if ($scope.linkPickerOverlay) {
                    $scope.linkPickerOverlay.show = false;
                    $scope.linkPickerOverlay = null;
                }
            };

        };

        SimpleMDE.prototype.drawImage = function (editor) {
            var callback = function (url) {
                if (!url) {
                    return false;
                }

                var stat = editor.getState(),
                    options = editor.options;

                replaceSelection(editor.codemirror, stat.image, options.insertTexts.image, url);
                return true;
            };

            openMediaPicker(callback);
        };

        SimpleMDE.prototype.drawLink = function (editor) {
            var callback = function (url, name, external) {
                if (!url) {
                    return false;
                }

                var options = editor.options,
                    insertText = options.insertTexts.link;

                if (name) {
                    if (external) {
                        insertText = ["<a href=\"#url#\" target=\"_blank\">" + name + "</a>", ""];
                    } else {
                        insertText = ["[" + name + "](#url#)", ""];
                    }
                } else if (external) {
                    insertText = ["<a href=\"#url#\" target=\"_blank\">", "</a>"];
                }

                var stat = editor.getState();
                replaceSelection(editor.codemirror, stat.link, insertText, url);
                return true;
            };

            openLinkPicker(callback);
        };
    });