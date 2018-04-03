app.controller("HomeCtrl", ['$scope', '$rootScope', '$filter', '$mdDialog', 'resistorService', function ($scope, $rootScope, $filter, $mdDialog, resistorService) {

    $scope.welcomeMessage = "Welcome to Your (Resistossistance App) assistance of resistor on basis of voice.";
    $scope.example = "orange,black,blue and silver";
    $scope.resistorColorCode = "";
    $scope.languages = [{ name: "English-US", value: "en-US" }, { name: "English-UK", value: "en-GB" }, { name: "English-IND", value: "en-IN" }]
    $scope.selectedLang = $scope.languages[1];

    $scope.final_span = "";
    $scope.interim_span = "";
    $scope.recognizing = false;
    $scope.info = {
        message: "Click on the microphone icon and begin speaking.",
        link: ""
    };
    $scope.start_img = { src: "/resources/img/mic.gif" };

    var start_timestamp = '';
    var finalIntentResult = '';
    var final_transcript = '';
    var ignore_onend = false;

    $scope.colorCodeTable = [];

    //***********************************   Scope Methods   *********************/

    var showInfo = function (messageType) {
        var infoObject = { message: "", link: "#" };
        switch (messageType) {
            case "info_start":
                infoObject.message = "Click on the microphone icon and begin speaking.";
                break;
            case "info_speak_now":
                infoObject.message = "Listening you... To know the resistance say like - I have a resistor with color orange black brown and silver.";
                break;
            case "info_no_speech":
                infoObject.message = "No speech was detected. You may need to adjust your microphone settings";
                infoObject.link = "//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892";
                break;
            case "info_End_speech":
                infoObject.message = "Stopped listening, Please click on microphone icon to start again.";
                infoObject.link = "//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892";
                break;
            case "info_no_microphone":
                infoObject.message = "No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.";
                infoObject.link = "//support.google.com/chrome/bin/answer.py?hl=en&amp;answer=1407892";
                break;
            case "info_allow":
                infoObject.message = "Click the Allow button above to enable your microphone.";
                break;
            case "info_denied":
                infoObject.message = "Permission to use microphone was denied.";
                break;
            case "info_blocked":
                infoObject.message = "Permission to use microphone is blocked. To change, go to chrome://settings/contentExceptions#media-stream";
                break;
            case "info_upgrade":
                infoObject.message = "Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later.";
                infoObject.link = "//www.google.com/chrome";
                break;

            default:
                break;
        }
        $scope.$apply(function () {
            $scope.info = infoObject;
        });

        // $scope.info = infoObject;
    }




    //*************************************************** Web Speech Api ******************************************************************************/

    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
        return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    var first_char = /\S/;
    function capitalize(s) {
        return s.replace(first_char, function (m) { return m.toUpperCase(); });
    }

    var assignImageIcon = function (imageLocation) {
        $scope.$apply(function () {
            $scope.start_img.src = imageLocation;
        });
    }

    var init = function (language) {
        if (!('webkitSpeechRecognition' in window)) {
            return null;
        } else {
            var recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = language;

            return recognition;
        }
    }

    var speechRecog = init("en-GB");
    if (speechRecog !== null) {
        speechRecog.onstart = function () {
            $scope.recognizing = true;
            showInfo('info_speak_now');
            assignImageIcon('/resources/img/mic-animate.gif');
        };

        speechRecog.onerror = function (event) {
            if (event.error == 'no-speech') {
                assignImageIcon('/resources/img/mic.gif');
                //showInfo('info_no_speech');
                ignore_onend = true;
            }
            if (event.error == 'audio-capture') {
                assignImageIcon('/resources/img/mic.gif');
                //showInfo('info_no_microphone');
                ignore_onend = true;
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    showInfo('info_blocked');
                } else {
                    showInfo('info_denied');
                }
                ignore_onend = true;
            }
        };

        speechRecog.onend = function () {
            $scope.recognizing = false;
            assignImageIcon('/resources/img/mic.gif');
            showInfo('info_End_speech');
        };

        speechRecog.onresult = function (event) {
            var interim_transcript = '';
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript + ". ";
                    resistorService.GetResistance(event.results[i][0].transcript).then(function (response) {
                        if (response.data.success) {
                            // console.log(response.data.band);
                            $scope.resitanceCalculated = response.data.content + " - band: " + response.data.band;
                        } else {
                            // console.log(response.data.content)
                            $scope.resitanceCalculated = response.data.content;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            final_transcript = capitalize(final_transcript);
            $scope.$apply(function () {
                $scope.final_span = linebreak(final_transcript);
                $scope.interim_span = linebreak(interim_transcript);
            });
        };

        $scope.startSpeechRec = function () {
            var currentDate = new Date();
            //Toggle the speech
            if ($scope.recognizing) {
                ignore_onend = false;
                $scope.isForcedToStop = true;
                speechRecog.stop();
            }
            else {

                ignore_onend = false;
                $scope.isForcedToStop = false;
                speechRecog.lang = $scope.selectedLang.value;
                final_transcript = "";
                interim_transcript = "";
                $scope.final_span = "";
                $scope.interim_span = "";
                $scope.resitanceCalculated = "";
                speechRecog.start();
                start_timestamp = currentDate.timeStamp;
            }
        }
    }
    else {
        showInfo('info_blocked');
    }

    $scope.showConfirm = function (ev) {

        $mdDialog.show({
            clickOutsideToClose: false,
            scope: $scope,        // use parent scope in template
            preserveScope: true,  // do not forget this if use parent scope  
            templateUrl: 'views/feedbackDialog.html',
            controller: function DialogController($scope, $mdDialog) {
                $scope.closeDialog = function () {
                    $scope.SubmitFeedback();
                    $mdDialog.hide();
                }
                $scope.cancel = function () {
                    $mdDialog.cancel();
                }
            }
        });

        // // Appending dialog to document.body to cover sidenav in docs app
        // var confirm = $mdDialog.confirm()
        //     .title('Your feedback can help us to improve !')
        //     .textContent('All of the banks have agreed to forgive you your debts.')
        //     .ariaLabel('Lucky day')
        //     .targetEvent(ev)
        //     .ok('Submit')
        //     .cancel('Cancel');

        // $mdDialog.show(confirm).then(function () {
        //     $scope.SubmitFeedback();
        // }, function () {
        //     //$scope.status = 'You decided to keep your debt.';
        // });
    };




    $scope.SubmitFeedback = function () {
        resistorService.SubmitFeedback($scope.feedback).then(function (response) {
            if (response.data.success) {
                $scope.feedback = {};
                toastr.success("Thank you! Your feedback has been submitted.");
            }
            else {
                console.log("Failed to log the message.")
            }
        }, function (error) {
            console.log(error)
        })
    }



}]);
