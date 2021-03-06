'use strict';


var user = {

    value1 : 9007199254740990,
    value2 : 0.9999,
    email: null,
    total: 0,
    totalNumber: 0,
    name : 'Pablo',
    geek: true,
    file: null,
    address: {
        street: null,
        city: 'Humenné',
        note: {
            value: null,
            number1: 9007199254740990,
            number2: 0.9999,
        },

    },

    items: [{name:'Item1', value:1},  {name:null, value:2},
      {name:null, value:null, subitems: [{name:'subitem3', value:null},
        {name:'subitem4', value:null, subsubitems:[{name:'subsubitem6', value:null},{name:'subsubitem7', value:null}]}]} ]


 };

/**
 * @ngdoc function
 * @name test1App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the test1App
 */
angular.module('test1App')

    .directive('toBig', function(){
        return{
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, element, attr, ngModel){

                ngModel.$formatters.push(function(value){
                    //console.log('formatter');
                    //from modtel to UI
                    //when code change model
                    if(value){
                        return new Big(value);
                    }
                    //return value.toUpperCase();

                });

                ngModel.$parsers.push(function(value){
                   //form UI to model
                    //console.log('Parser');
                    //return value.toUpperCase();
                    //value for model
                    if(value){
                      return new Big(value);
                    }
                    return null;
              });

            }
        };
    })


.directive('saModel', function ($compile) {
    return {
        priority:1,
        restrict: 'A',
        require:  ['ngModel', '^?ngModelOptions'],
        compile: function(element, attributes, ngModel){

            /*if( (~!!attributes.ngModel.indexOf('sg_'))) {*/

            var lastIndex = attributes.ngModel.lastIndexOf('.');
            var part1 = attributes.ngModel.substr(0, lastIndex+1);
            var part2 = 'sg_'+attributes.ngModel.substr(lastIndex+1, attributes.ngModel.length);

            attributes.ngModel = part1+part2;
            //}


            return {

                pre: function (scope, element, attr, ctrls) {

                    //DataBindingContext.addBinding(attr.ngModel.replace("sg_",""), element[0]);

                    var modelCtrl = ctrls[0];
                    ctrls[2] = {};
                    ctrls[2].$options = {};

                    ctrls[2].$options['getterSetter'] = true;
                    ctrls[2].$options['updateOnDefault'] = true;

                    modelCtrl.$$setOptions(ctrls[2] && ctrls[2].$options);

                },
             }
         },
    }
})

    .directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs,ngModel) {
                    // var model = $parse(attrs.ngModel);
                    // var modelSetter = model.assign;
                        element.bind('change', function(){
                         $parse(attrs.fileModel).assign(scope,element[0].files[0])
                           scope.$apply(function(){
                            // modelSetter(scope, element[0].files[0]);
                            ReflectionUtils.createSettersGetters(file, '');
                            ShadowAnnotations.doValidation(user);
                            UiUpdater.updateUi();
                           });
                        });
                     
                    // attrs.$observe('fileModel', function(fileModel){
                    //     model = $parse(attrs.fileModel);
                    //     modelSetter = model.assign;
                    // });

                    
                    // element.bind('change', function(){
                    //     scope.$apply(function(){
                    //         var file = element[0].files[0];
                    //         ReflectionUtils.createSettersGetters(file, '');
                    //         modelSetter(scope.$parent, file);
                            // ShadowAnnotations.doValidation(user);
                            // UiUpdater.updateUi();
                    //     });
                    // });
                }
            };
        }])

  .directive('saBind', function () {
    return {
        priority:1,
        restrict: 'A', // only activate on element attribute
        require:  ['ngModel', '^?form', '^?ngModelOptions'], // get a hold of NgModelController
        link: function (scope, element, attrs, ngModel) {
            var propertyPath = attrs.ngModel.replace('sg_','');


            DataBindingContext.addBinding(propertyPath, element[0]);
            ShadowAnnotationsRegister.getUiUpdater().updateControlUi(propertyPath);
        }
    }
  })

  .directive('saBindWithIndex', function () {
    return {
      priority:1,
      restrict: 'A', // only activate on element attribute
      require:  ['ngModel', '^?form', '^?ngModelOptions'], // get a hold of NgModelController
      link: function (scope, element, attrs, ngModel) {

        var indexes = attrs.saBindWithIndex.split(',');
        var property = attrs.ngModel;
        var propertyPath = replaseIndexies(indexes, property);

        propertyPath = propertyPath.replace('sg_','');

        DataBindingContext.addBinding(propertyPath, element[0]);
        ShadowAnnotationsRegister.getUiUpdater().updateControlUi(propertyPath);


        function replaseIndexies(indexes, path) {
          for(var i = indexes.length; i>0; i-- ) {
            path = path.replace(replaseString(i)+'$index', indexes[indexes.length-i])
            //console.log(indexes.length-i);
            //console.log(path);
          }
          return path;
        }
        function replaseString(index) {
          var result = ''
          for(var i = index-1; i>0; i-- ) {
            result += '$parent.';
          }
          //console.log('replace string '+result);
          return result;
        }
      },
    }
  })

  .controller('AboutCtrl', function ($scope) {

    $scope.validationErrors = ValidationErrors.getErrors();

    $scope.errorsAndWarningsCount = function () {
      return ValidationErrors.getErrors().length + ValidationWarnings.getWarnings().length;
    }

    var data = {

    }
    $scope.data = data;

 

    var userShadow = {

        sa$value1 : { notEmptyValidation: {},  calculation: {}  },
        sa$value2 : { notEmptyValidation: {},  calculation: {}  },
        sa$email : { notEmptyValidation: {}, emailValidation: {} },
        sa$totalNumber: { bigConversion : {}  },

        sa$name : { notEmptyValidation: {} } ,

        sa$address: { beanValidation: {} },
        address: {

            sa$street : { notEmptyValidation: {} },
            sa$city : { notEmptyValidation: {}, cityParamsValidation : {} },

            sa$note: { beanValidation: {} },
            note: {
                sa$value : { noteValidation: {} },
                sa$number1: { notEmptyValidation: {}, calculation: {}, bigConversion : {}  },
                sa$number2: { notEmptyValidation: {}, calculation: {}, bigConversion : {}  },
            },
        },
        sa$items: { arrayConversion:{}, itemsValidation:{}, arrayValidation:{}},
        items: {
          sa$name: {notEmptyValidation: {}},
          sa$value: {notEmptyValidation: {}},
          sa$subitems: {arrayConversion:{}, arrayValidation:{}},
          subitems: {
            sa$name: {notEmptyValidation: {}},
            sa$value: {notEmptyValidation: {}},
            sa$subsubitems: {arrayConversion:{}, arrayValidation:{}},
            subsubitems: {
              sa$name: {notEmptyValidation: {}},
              sa$value: {notEmptyValidation: {}},
            }
          }

        },
        sa$file: {beanValidation: {}},
        file: { 
            sa$name:{notEmptyValidation: {}},
            sa$size: {notEmptyValidation: {}}
        }
     };

    //ShadowAnnotationsRegister.addShadowObject(user.sa$sa, userShadow);

    ShadowAnnotations.link('user', user, userShadow, true);
    $scope.user = user;

    ShadowAnnotationsRegister.addGlobalValidator('user',GlobalValidator);


    var userClone = ReflectionUtils.cloneObject(user);
    ReflectionUtils.convertFrom(userClone);
    $scope.data.userClone = userClone;

    $scope.fireValidation = fireValidation;
    var fireValidationCalled = false;
    function fireValidation() {

        if(!fireValidationCalled) {
            BeanValidator.doValidation(null, null, user);
            ShadowAnnotationsRegister.getUiUpdater().updateUi();
            fireValidationCalled = true;
        }
    }

    $scope.enableEdit = enableEdit;

    var editMode = false;

    function enableEdit() {
        var bindings = DataBindingContext.getBindings();

        for(var i in bindings) {

            if(!editMode) {

                if(bindings[i].element.getAttribute('type')=='checkbox') {
                    bindings[i].element.removeAttribute('disabled');
                }
                else {
                    bindings[i].element.removeAttribute('readonly');
                }
            }
            else {
                if(bindings[i].element.getAttribute('type')=='checkbox') {
                    bindings[i].element.setAttribute('disabled',true);
                }
                else {
                    bindings[i].element.setAttribute('readonly',true);
                }
            }

        }

        if(!editMode) {

            DataBindingContext.enable();
            ShadowAnnotations.doValidation(user);
            ShadowAnnotations.updateUi();
            fireValidationCalled = true;
        }
        else {
            DataBindingContext.disable();
            ValidationErrors.removeAllErrors();
            ValidationWarnings.removeAllWarnings();
            ShadowAnnotations.updateUi();
        }


        editMode = !editMode;
    }

    //DataBindingContext.enable();
    //ShadowAnnotations.doValidation(user);


    $scope.convertFrom = convertFrom;

    function convertFrom() {

         $scope.data.userClone = ReflectionUtils.convertFrom(ReflectionUtils.cloneObject(user));

    }

    $scope.addItem = addItem;
    $scope.removeLastItem = removeLastItem;

    function addItem() {

      var rn = Math.floor((Math.random() * 100) + 1);
      $scope.user.items.push({name: 'Item '+rn, value:null, subitems:[{name:'suibtem'+rn+'.1', value:null},{name:'suibtem'+rn+'.2', value:null}]});
      return false;
    }
    function removeLastItem() {
      //$scope.user.items[2].subitems[1].subsubitems.pop();
      $scope.user.items[$scope.user.items.length-1].subitems.pop();
      return false;

    }


  });
