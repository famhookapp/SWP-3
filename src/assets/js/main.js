$(function() {
	/** Category menu toggle **/
	$(".lg-category-nav").click(function(e){
		e.stopPropagation();
		$(".dsktp-category-menu").fadeToggle();
		$(".notification-details, .cart-details, .user-details ul.dropdown-menu").hide();
	});
	
	/** Notification menu toggle **/
	$(".notification").click(function(e){
		e.stopPropagation();
		$(".notification-details").fadeToggle();
		$(".dsktp-category-menu,.cart-details, .user-details ul.dropdown-menu").hide();
	});
	
	/** Cart menu toggle **/
	$(".cart").click(function(e){
		e.stopPropagation();
		$(".cart-details").fadeToggle();
		$(".dsktp-category-menu,.notification-details, .user-details ul.dropdown-menu").hide();
	});
	
	/** Close (Notification, Cart, Category) menu on document click **/
	$(document).click(function(){  
		$('.dsktp-category-menu,.notification-details,.cart-details, .user-details ul.dropdown-menu').hide(); //hide the button
	});
	$(".dsktp-category-menu,.notification-details,.cart-details").click(function(e){
		e.stopPropagation();
	});
	
	/** Custom Select **/
	$(".custom-select").each(function(){
		$(this).wrap("<span class='select-wrapper'></span>");
		$(this).after("<span class='holder'></span>");
	});
	$(".custom-select").change(function(){
		var selectedOption = $(this).find(":selected").text();
		$(this).next(".holder").text(selectedOption);
	}).trigger('change');
	
	$('.dropdown-toggle').click(function(){
		$(this).next().fadeToggle();
		$(".notification-details, .cart-details, .dsktp-category-menu").hide();
	});

});