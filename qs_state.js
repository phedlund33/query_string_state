	$(function(){
		//get the querystring parameters using the bbq library:
		var params = $.deparam.querystring();
		console.log(params);
		var param_prop;
		//iterate over all querystring params and set the UI accordingly:
		for(var propt in params)
		{
			//set the class of the links that are already in the query string
			//Need to iterate over this as an object - if there are multiple facets of one facet type selected
			if(typeof params[propt] == "string") //<--- There is just one parameter in the querystring
			{				
				param_prop = params[propt].toLowerCase();
				$("#all_facets div a[data-id="+param_prop+"]").toggleClass("nwSelected");
				if(propt != "searchterms") //don't want to add breadcrumbs for searchterms
				{
					$("#breadCrumbs .crumbList").append("<a class='remove' href='#' title='"+param_prop+"'>"+param_prop+"</a>").click(function (f)
					{
						var clickedClass = $(f.target).attr('class');
						if(clickedClass == "remove")
						{
							$(f.target).remove();
						}
					});
				}
			}
			else
			{
				
				for(var i=0;i<params[propt].length; i++)
				{
					$("#all_facets div a[data-id="+params[propt][i]+"]").toggleClass("nwSelected");	
					//alert(params[propt][i]);
					$("#breadCrumbs .crumbList").append("<a class='remove' href='#' title='"+params[propt][i]+"'>"+params[propt][i]+"</a>").click(function (f)
					{
						var clickedClass = $(f.target).attr('class');
						if(clickedClass == "remove")
						{
							$(f.target).remove();
						}
					});
				}
			}
									
		}
		
	});
	
	//**************************************
	//*** Open and close each facet section
	//*************************************
	$("#all_facets h4").click(function() {
		var myClass = $(this).attr("class");
		if(myClass == "stripeOuter navOpen")
		{
			$(this).next("div").slideUp("fast");
			$(this).removeClass("navOpen");
			$(this).addClass("navClosed");
		}
		else
		{
			$(this).next("div").slideDown("fast");
			$(this).removeClass("navClosed");
			$(this).addClass("navOpen");
		}
	});
	//*******************************************
	//*** Assign click function to bread crumbs
	//*******************************************
	$("#breadCrumbs .crumbList").click(function (e){
		var clickedClass = $(e.target).attr('class'); //get the class of the element clicked
		if(clickedClass == "remove") //only remove the element if it's the link element and not the div
		{
			var text_to_remove = $(e.target).text();
			text_to_remove = text_to_remove.toLowerCase();
			$("#all_facets div a:contains('"+text_to_remove+"')").toggleClass("nwSelected");
			updateQS();
		}
	});
	
	//*******************************************
	//*** Loop over all the facets and create 
	//*** string string to append to and load URL
	//*******************************************
	function updateQS()
	{
		var strQS = "";
		$( "#all_facets a" ).each(function( index ) {
			if($(this).hasClass("nwSelected"))
			{	  
				strQS += "&"+$(this).data('facet')+"="+$(this).data("id");
			}
		});
		//need to get the "searchterms" querystring value to append back onto the querystring
		var search_terms = getParameterByName('searchterms');
		alert(search_terms);
		//THIS MAY NEED TO BE CHANGED TO "location.host" when on a server:
		var basePath=location.pathname;
		window.location = basePath + "?searchterms=" + search_terms +strQS;
	}
	//**************************************************
	//*** GET a QUERYSTRING VALUE BY NAME
	//**************************************************
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	//**************************************************
	//*** Function called when a checkbox is clicked
	//*************************************************
	$("#all_facets div a").click(function (e) {		
		e.preventDefault();
		$(e.target).toggleClass("nwSelected");
		//reload page with new state
		updateQS();
	});