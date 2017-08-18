var testModel = angular.module("testModel",[]);
testModel.controller("testController", function($scope){
	$.get('county_address.json', function(data){
		$scope.country_add = data.RECORDS;
	})
	$.get('city_address.json', function(data){
		$scope.city_add = data.RECORDS;
	})
	$.get('provinces_address.json', function(data){
		$scope.provinces_add = data.RECORDS;
		$scope.provincesDefault_list = data.RECORDS;
	})

	$scope.initdata = function(){
		// 省初始化
		$scope.provincesDefault_list_index = 0;
		$scope.provinces_show = $scope.provincesDefault_list;
		$(".provinces_ ul").css("top",-22*($scope.provincesDefault_list_index)+"px");

		// 市初始化	
		$scope.cityDefault_list = [];
		$.each($scope.city_add, function(){
			if(this.parent_id == $scope.provincesDefault_list[$scope.provincesDefault_list_index].city_id){
				$scope.cityDefault_list.push(this);
			}
		})
		$scope.cityDefault_list_index = 1;
		$(".city_ ul").css("top",-22*($scope.cityDefault_list_index-1)+"px");
		$scope.city_show = $scope.cityDefault_list;
		// 城乡初始化
		$scope.countryDefault_list = [];
		$.each($scope.country_add, function(){
			if(this.parent_id == $scope.cityDefault_list[$scope.cityDefault_list_index].city_id){
				$scope.countryDefault_list.push(this);
			}
		})
		$scope.countryDefault_list_index = 1;
		$(".country_ ul").css("top",-22*($scope.countryDefault_list_index-1)+"px");
		$scope.country_show = $scope.countryDefault_list;
	}


	var begin_y, //开始滑动时手指位置
		currentTop, //开始滑动时列表相对定位top值
		_max, //列表最大长度
		curritem;//滑动之后显示列表第几项
	var change =0;//改变之后的currentTop
	var citylist_current=[];//目前的 城市？列表
	//滑动事件功能：在知道列表的情况下输出 所选对象的ID 
	$scope.touchEv = function(obj){
		//滑动开始
		$(document).on('touchstart', obj, function(e){
			e.pr
			console.log("touchstart");
	    	currentTop = parseInt($(e.currentTarget).css("top"));
	    	begin_y = e.originalEvent.targetTouches[0].pageY;
	    	if (obj==".provinces_ ul") {
	    		_max = -($scope.provinces_show.length-1)*22;
	    	}
	    	if (obj==".city_ ul") {
	    		_max = -($scope.city_show.length-1)*22;
	    		console.log(_max);
	    	}
	    	if (obj==".country_ ul") {
	    		_max = -($scope.country_show.length-1)*22;
	    	}
		})
		//滑动滑动触发
		$(document).on('touchmove',obj , function(e){
			change = parseInt(e.originalEvent.changedTouches[0].pageY - begin_y) + currentTop;
			
			if (change < _max) {
				$(e.currentTarget).css("top",_max+"px");
				change = _max;
			}else if(change>0){
				$(e.currentTarget).css("top",0+"px");
				change = 0;
			}
			else{
				$(e.currentTarget).css("top",change+"px");
			}
		})
		//滑动停止
		$(document).on('touchend',obj, function(e){
			// console.log(obj);
			currentTop = 22*Math.round(change/22);
			curritem = -currentTop/22;
			// console.log(curritem+1);

			$(e.currentTarget).css("top",currentTop+"px");	
			if (obj==".provinces_ ul") {
				console.log($scope.provinces_show[curritem].city_id);
				console.log($scope.provinces_show[curritem].city_name);
				console.log($scope.provinces_show[curritem].parent_id);
				$(".city_ ul").css("top",0+"px");
				$(".country_ ul").css("top",0+"px");
				//更新下个列表city
				var citytemplist =[];
				$.each($scope.city_add, function(){
					if(this.parent_id == $scope.provinces_show[curritem].city_id){
						citytemplist.push(this);
					}
				})
				$scope.city_show = citytemplist;
				//更新下个列表country
				var countrytemplist =[];
				$.each($scope.country_add, function(){
					if(this.parent_id == $scope.city_show[0].city_id){
						countrytemplist.push(this);
					}
				})

				$scope.country_show = countrytemplist;
				$scope.$apply();
			}
			if (obj==".city_ ul") {
				console.log($scope.city_show[curritem].city_id);
				console.log($scope.city_show[curritem].city_name);
				console.log($scope.city_show[curritem].parent_id);
				$(".country_ ul").css("top",0+"px");
				//更新下个列表country
				
				var countrytemplist =[];
				$.each($scope.country_add, function(){
					if(this.parent_id == $scope.city_show[curritem].city_id){
						countrytemplist.push(this);
					}
				})
				$scope.country_show = countrytemplist;
				$scope.$apply();
			}
			if (obj==".country_ ul") {
				console.log($scope.country_show[curritem].city_id);
				console.log($scope.country_show[curritem].city_name);
				console.log($scope.country_show[curritem].parent_id);
			}
		})
	}

	$scope.touchEv(".provinces_ ul");
	$scope.touchEv(".city_ ul");
	$scope.touchEv(".country_ ul");
});
testModel.directive("inputdd", function(){
	return {
		restrict: 'E',
		scope: {
			locaal: '=nameprop'

		},
		replace: false,
		template: "<span ng-click='delNum()'>-</span><input id='provSelect1' type='text' ng-model='locaal' ng-blur= 'blur_()' ng-keyup='onkeyup($event)' ng-afterpaste='onafterpaste($event)'></input><span ng-click='addNum()'>+</span>",
		link: function(scope, element, attra){
			// console.log(element);
			var inp = element.context.childNodes[1];
			$(inp).bind('input propertychange', function(e){
				inp.value = inp.value.replace(/[^0-9]/g,'');
				// console.log(e.target);
				if(parseInt(inp.value)>100){
					inp.value = 99;
				}
				if(parseInt(inp.value) == 0){
					inp.value = 1;
				}
				scope.locaal = inp.value;

			})	
			// 先触发失去焦点事件
			scope.blur_ = function(){
				if (! inp.value) {
					inp.value = 1;
					scope.locaal = 1;	
				}
			}
			scope.addNum = function(){
				scope.locaal = parseInt(scope.locaal) + 1;
				if (scope.locaal > 99) {
					scope.locaal = 99;
				}
			}
			scope.delNum = function(){
				scope.locaal = parseInt(scope.locaal) - 1;
				if (scope.locaal<1) {
					scope.locaal = 1;
				}
			}
		}
	}
})
testModel.directive("checkboxdd", function(){
	return {
		restrict: "E",
		scope: {
			checkboxtitle: "@title"
		},
		template:"<div class='checkouterbox'><div class='checkindexbox'></div></div><p>{{checkboxtitle}}</p>",
		replace: false,
		link: function(scope, element, attra){
			var type = $(element).parent().attr("type");
			// console.log(type);
			if (type == "checkbox") {
				var ch_in_bo = $(element).find(".checkindexbox");
				$(element).click(function(){
					ch_in_bo.hasClass("oncheckdd") ? ch_in_bo.removeClass("oncheckdd") : ch_in_bo.addClass("oncheckdd");
				})
			} else{
				var ch_in_bo = $(element).find(".checkindexbox");
				$(element).click(function(){
					var list = $(element).parent().children(".checkbox_dd");
					angular.forEach(list, function(data, index){
						$(data).find(".checkindexbox").removeClass("oncheckdd");
					})
					ch_in_bo.hasClass("oncheckdd") ? ch_in_bo.removeClass("oncheckdd") : ch_in_bo.addClass("oncheckdd");
				})
			}
			
			// console.log(attra.type);
		}
	}
})

