
function ImageViewer() {
	var currentColl;
    var currentImg;

    this.showImageLayer = function() {
	   $('.imageLayer > .imageContainer').empty();
	   $('.imageLayer').css({visibility:'visible', opacity: 0.0}).animate({opacity: 1.0},200);
    }

    this.hideImageLayer = function() {
        currentImg = 0;
        currentColl = 0;

        $('.imageLayer > .imageContainer').empty();
        $('.imageLayer').animate({opacity: 0.0}, 200, function(){
            $('.imageLayer').css('visibility','hidden');
        });
    }

    this.putImage = function(img) {
		currentColl = img.attr('data-collection');
		currentImg = img.attr('src');
		var type = img.attr('data-type');
		var path = img.attr('src').replace('thumbnails/', '');

		var element;

		if (type === 'video') {
			var url = img.attr('data-url');
			//path = path.replace('png', 'mp4');
			
			element = '	<video class="image" controls> \
							<source src="'+url+'" type="video/mp4"> \
						</video>';
		}
		else {
			element = '<img src="'+path+'" class="image">';
		}
	  
		var f = function() {
			$('.imageLayer > .imageContainer').empty();
			$('.imageLayer > .imageContainer').append(element);
			$('.image').css({opacity: 0.0}).animate({opacity: 1.0},200);
		}

	    if ($('.image').length > 0) {
			$('.image').animate({opacity: 0.0}, 200, f);
		}
        else {
			f();
        }
    }

    this.nextImage = function() {
	   if (currentImg != 0){
           var next = $('img[src="'+currentImg+'"]').next('.thumbnail[data-collection="'+currentColl+'"]');
           if (next.length == 0) {
               next = $('.thumbnail[data-collection="'+currentColl+'"]:first');
           }
           this.putImage(next);
       }
    }

    this.prevImage = function() {
	   if (currentImg != 0) {
           var prev = $('img[src="'+currentImg+'"]').prev('.thumbnail[data-collection="'+currentColl+'"]');
           if (prev.length == 0) {
               prev = $('.thumbnail[data-collection="'+currentColl+'"]:last');
           }
           this.putImage(prev);
       }
    }

    var me = this;

    $(document.body).on('keydown', function(event) {
        if (event.key == 'ArrowRight') {
            me.nextImage();
        }

        if (event.key == 'ArrowLeft') {
            me.prevImage();
        }

        if (event.key == 'Escape') {
            me.hideImageLayer();
        }
    });
}

window.onload = function() {

    var iv = new ImageViewer();

    $(document.body).on('click', '.thumbnail' ,function(){
        iv.showImageLayer();
        iv.putImage($(this));
    });

    $(document.body).on('click', '.prevCtrl' ,function(){
        iv.prevImage();
    });

    $(document.body).on('click', '.nextCtrl' ,function(){
        iv.nextImage();
    });

    $(document.body).on('click', '.closeCtrl' ,function(){
        iv.hideImageLayer();
    });
}
