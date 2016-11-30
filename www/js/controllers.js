function isEmpty(str) {
  return (!str || 0 === str.length);
}

angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    //Dati applicazione
    $scope.appData = {
      username: '',
      password: ''
    };


    $scope.settings = {
      server_url: 'http://51.254.99.54:8082/madeSecurity/ajax/method/',
      app_name: 'Made in Security'
    };
  })

  .controller('HomeCtrl', function ($scope, $stateParams, $ionicModal) {
    /*
    $ionicModal.fromTemplateUrl('templates/settings.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.popupSettings = modal;
    });

    $scope.settings= function(){
      $scope.popupSettings.show();
    };

    $scope.back = function(){
      $scope.popupSettings.hide();
    };

    $scope.save = function(){

    };
    */

  })


  .controller('SettingsCtrl', function ($scope, $stateParams, $ionicModal) {
    $scope.save = function () {

    };
  })

  .controller('LeggiCodiceCtrl', function ($scope, $stateParams, $ionicPopup, $http, $state) {
    $scope.stato_valida = 'VALIDA';
    $scope.error = false;
    $scope.bc = {};
    $scope.tentativi_rimasti = 0;

    $scope.leggiBarcode = function () {

      cordova.plugins.barcodeScanner.scan(
        function (result) {
          if (!result.cancelled) {
            $scope.bc.barcode = result.text;
            $scope.$apply();
          }
        },
        function (error) {
          var alertPopup = $ionicPopup.alert({
            title: 'Errore',
            template: "Errore di scansione: " + error
          });

        }
      );

    };

    $scope.validaProdotto = function () {
      var message = '';
      if (isEmpty($scope.bc.barcode)) {
        message += "Barcode obbligatorio<br/>";
      }
      if (isEmpty($scope.bc.bar_pass)) {
        message += "Codice di sicurezza obbligatorio <br/>";
      }

      if (!isEmpty(message)) {
        var alertPopup = $ionicPopup.alert({
          title: 'Errore',
          template: message
        });

      } else {

        $http.post($scope.settings.server_url + "imp.api.Autentica/valida",
          {
            id_consumatore: $scope.appData.consumatore.id_consumatore,
            email: $scope.appData.email,
            password: $scope.appData.password,
            barcode: $scope.bc.barcode,
            bar_pass: $scope.bc.bar_pass
          })
          .success(function (response) {
            var esito = response.esito;
            if (esito == 'OK') {
              $scope.bc.prodotto = response.prodotto;
              $scope.stato_valida = 'OK';
            } else if (esito == 'KO') {
              $scope.error = true;
              $scope.tentativi_rimasti = response.tentativi_rimasti;
              if (response.tentativi_rimasti <= 0) {
                $scope.stato_valida = 'KO';
              } else {
                $scope.stato_valida = 'VALIDA';
              }

            }
          }).error(function (error, status) {
            if (status == 301) {
              window.location.replace(error);
            }
            var alertPopup = $ionicPopup.alert({
              title: 'Errore',
              template: error
            });


          });

      }
    };

    $scope.tornaProgrammi = function () {
      $state.go('^.programs');
    };

  })

  .controller('TuoiAcquistiCtrl', function ($scope, $stateParams, $ionicPopup, $http) {
    $http.post($scope.settings.server_url + "imp.api.StoricoAcquisti/getAcquisti",
      { id_consumatore: $scope.appData.consumatore.id_consumatore })
      .success(function (response) {
        $scope.i_miei_acquisti = response;
      }).error(function (error, status) {
        if (status == 301) {
          window.location.replace(error);
        }

        var alertPopup = $ionicPopup.alert({
          title: 'Errore',
          template: error
        });


      });

  })

  .controller('StoreLocatorCtrl', function ($scope, $stateParams, $ionicLoading, $cordovaGeolocation, $http, $ionicPopup) {

    var options = { timeout: 10000, enableHighAccuracy: true };

    $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

      var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      var mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

      google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        $http.post($scope.settings.server_url + "imp.api.StoreLocator/getStores",
          {})
          .success(function (response) {
            for (var i = 0; i < response.length; i++) {
              var store = response[i];

              var stLatLng = new google.maps.LatLng(store.lat, store.lng);
              var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: stLatLng
              });

              var infoWindow = new google.maps.InfoWindow({
                content: store.ragione_sociale
              });

              google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
              });

            }
          }).error(function (error, status) {
            if (status == 301) {
              window.location.replace(error);
            }

            var alertPopup = $ionicPopup.alert({
              title: 'Errore',
              template: error
            });


          });
      });


    }, function (error) {
      console.log("Could not get location");
    });





  })


  .controller('LoginCtrl', function ($scope, $stateParams, $cordovaOauth, $ionicConfig, $state, $ionicPopup, $ionicHistory, $http, $rootScope) {
    $ionicConfig.backButton.text("");

    //Vai alla schermata di registrazione
    $scope.register = function () {
      $ionicHistory.currentView($ionicHistory.backView());
      $state.go('^.register');
    };

    var fbLoginSuccess = function (userData) {
      facebookConnectPlugin.api('/me/friends?fields=picture,name', ["basic_info", "user_friends"],
        function (result) {
          alert("Result: " + JSON.stringify(result));
        },
        function (error) {
          alert("Failed: " + error);
        }
      );

    }

    /*$scope.facebook_login = function(){
        facebookConnectPlugin.login(
            ["basic_info"], 
            fbLoginSuccess, 
            function (error) { 
                alert("" + error);
            }
        );

    };*/

    $scope.facebook_login = function () {
      $cordovaOauth.facebook("1607225242907242", ["email", "public_profile"], { redirect_uri: "http://localhost/callback" })
        .then(function (authResponse) {
          var access_token = authResponse.access_token;
          $http.get("https://graph.facebook.com/v2.6/me", {
            params: {
              access_token: access_token,
              fields: "id,name,gender,locale,email,picture",
              format: "json"
            }
          }).then(function (profileInfo) {
            
          $http.post($scope.settings.server_url + "imp.api.Login/loginfb", profileInfo)
            .success(function (response) {
              $scope.appData.consumatore = response;
              $state.go('^.programs');

            }).error(function (error, status) {
              if (status == 301) {
                window.location.replace(error);
              }

              var alertPopup = $ionicPopup.alert({
                title: 'Errore',
                template: error
              });


            });

            alert(JSON.stringify(authResponse));
            console.log(JSON.stringify(profileInfo));

          }, function (fail) {
            $ionicPopup.alert({
              title: 'Attenzione!',
              cssClass: 'text-center',
              template: 'Errore: ' + fail
            });            
            
          })
        }, function (error) {
          $ionicPopup.alert({
            title: 'Attenzione!',
            cssClass: 'text-center',
            template: 'si è verificato un errore riprova.'
          });
        });
    }

    //Effettua il login
    $scope.login = function () {
      $http.post($scope.settings.server_url + "imp.api.Login/login",
        { email: $scope.appData.email, password: $scope.appData.password })
        .success(function (response) {
          $scope.appData.consumatore = response;
          $state.go('^.programs');

        }).error(function (error, status) {
          if (status == 301) {
            window.location.replace(error);
          }

          var alertPopup = $ionicPopup.alert({
            title: 'Errore',
            template: error
          });


        });

    };
  })

  .controller('ProgramsCtrl', function ($scope, $stateParams, $ionicConfig, $ionicPopup, $http, $state, $ionicSlideBoxDelegate) {
    $scope.logout = function () {
      $scope.appData.consumatore = {};
      $scope.appData.username = '';
      $scope.appData.password = '';

      $state.go('^.home');
    };

    $scope.slidePrevious = function () {
      $ionicSlideBoxDelegate.previous();
    }

    $scope.slideNext = function () {
      $ionicSlideBoxDelegate.next();
    }

  })

  .controller('RegisterCtrl', function ($scope, $stateParams, $ionicConfig, $ionicPopup, $http, $state) {

    $ionicConfig.backButton.text("");
    $scope.regForm = {};

    $scope.register = function () {
      var message = '';
      if (isEmpty($scope.regForm.email)) {
        message += "Email obbligatoria <br/>";
      } else {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test($scope.regForm.email)) {
          message += "Email non valida <br/>";
        }
      }
      if (isEmpty($scope.regForm.password)) {
        message += "Password obbligatoria <br/>";
      } else if (isEmpty($scope.regForm.passwordConf)) {
        message += "Conferma Password obbligatoria <br/>";
      } else if ($scope.regForm.password != $scope.regForm.passwordConf) {
        message += "Le 2 Password non coincidono <br/>";
      }
      if (isEmpty($scope.regForm.denominazione)) {
        message += "Denominazione obbligatoria <br/>";
      }
      if (isEmpty($scope.regForm.genere)) {
        message += "Sesso obbligatorio <br/>";
      }

      if (!isEmpty(message)) {
        var alertPopup = $ionicPopup.alert({
          title: 'Errore',
          template: message
        });
      } else {
        $http.post($scope.settings.server_url + "imp.api.Login/register",
          { regForm: $scope.regForm })
          .success(function (response) {
            var alertPopup = $ionicPopup.alert({
              title: 'Info',
              template: 'Utente registrato. ' +
              $scope.settings.app_name +
              ' ti ha inviato una mail che devi confermare prima di poter accedere al sistema.'
            });

            alertPopup.then(function (res) {
              $state.go('^.login', {}, { location: 'replace' });
            });


          }).error(function (error, status) {
            if (status == 301) {
              window.location.replace(error);
            }

            var alertPopup = $ionicPopup.alert({
              title: 'Errore',
              template: error
            });


          });
      }

    }
  });




