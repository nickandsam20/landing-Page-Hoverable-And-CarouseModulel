class landingPageHoverableAndCarouseModulel{
	constructor(data){
			this.containerId=data.name;
			this.imgLinks=data.links;
			this.length=this.imgLinks.length;
			this.originWidth=$("#"+this.containerId).width();
			this.originHeight=$("#"+this.containerId).height();
			this.constructIintDiv();
			this.container=$("#"+this.containerId);
			this.dragBeginMouseX=0;
			this.dragBeginMouseY=0;
			this.currentSlidePage=-1;
	}
	
	constructIintDiv(){
		$("#"+this.containerId).css({
			"margin": 0,
			"padding": 0,
			"border": "none",
			"box-sizing": "border-box",
			"overflow-y": "hidden",
			"overflow-x": "hidden",
			"font-size":0,
			"white-space":"nowrap",
			"display":"inline-block",
			"position":"relative"
		});
		
		for(let i=0;i<this.length;i++){
			let parentEl=document.createElement("div");
			$(parentEl).attr("id","_parentEl"+i);
			$(parentEl).css({
				"display": "inline-block",
				"margin": "0px",
				"padding": "0px",
				"width":(this.originWidth/this.length)+"px",
				"height": this.originHeight+"px",
				"background-position":"center",
				"transition":"all 1s",
				"background-image": "url("+this.imgLinks[i]+")",
				"background-size":"cover"
			});
			
			let childEl=document.createElement("div");
			$(childEl).attr("id","_childEl"+i);
			$(childEl).css({
					"height":this.originHeight+"px"
			});
			$(parentEl).append(childEl);
			$("#"+this.containerId).append(parentEl);
			
			$(childEl).click({index:i},this.childElClickEvent);
			this.parentElHoverHandler(parentEl,i);
		}
	}
	
	childElClickEvent=(event)=>{
			this.currentSlidePage=event.data.index;
		
		//這邊的this是指class的instance,不是被click的element
			let clickedElement=$(event.currentTarget);
			let parent=clickedElement.parent();//box
			let clone=$(parent).clone(true);//holder
			$(clone).css({
				"visibility": "hidden"
			});
			let parentOriginPos=$(parent).position();
			$(parent).before($(clone));
			$(parent).empty();
			$(parent).attr("id","_expand"+event.data.index);//更改id避免跟原本的重複
			$(parent).off();//unbind all event(為了避免觸發hover)!

			$(parent).css({
				"position": "absolute",
				"left": parentOriginPos.left + "px",
				"top": parentOriginPos.top + "px",
				"transition":"none"
			});
			$(parent).animate({
				"top": 0,
				"left": 0,
				"width":this.originWidth+"px",
				"height":this.originHeight+"px",
			}, { duration:1000,complete:function(){
			}});
		
			
		//幫初始被點即放大的圖片綁定滑動事件
		$(parent).on("mousedown",(event)=>{
			this.dragBeginMouseX=event.originalEvent.screenX;
			this.dragBeginMouseY=event.originalEvent.screenY;
		})
		
		$(parent).on("mouseup",(event)=>{
			//slide誤差判斷
			if(Math.abs(event.originalEvent.screenX-this.dragBeginMouseX)<20)return;
			
			if(event.originalEvent.screenX-this.dragBeginMouseX>0)this.slide("next");
			else this.slide("prev");
		})
		
		//幫其他被滑動的物品綁定滑動事件
		this.showOtherElement(event.data.index);
		this.createSlidingIndicator(event.data.index);
		this.createSlideArrow();
	}
	elementChangeSize=(el,size)=>{
		//el param是 class或id的name
		$(el).css({
			"width":size+"px"
		});
	}
	parentElHoverHandler=(parentEl,i)=>{
		let preName="#_parentEl";
		let width=$(parentEl).width();
		let deltaPercentage=0.2;
		let delta=width*(deltaPercentage)/this.length;
		$(parentEl).mouseenter({param1:i},()=>{
			for(let j=0;j<this.length;j++){
				if(i!=j){
					this.elementChangeSize(preName+j.toString(),width-delta);
				}else{
					$(parentEl).css({
						"width":width*(1+deltaPercentage)+"px"
					});
				}
			}
		})
		$(parentEl).mouseleave({param1:i},()=>{
			for(let j=0;j<this.length;j++){
				if(i!=j){
					this.elementChangeSize(preName+j.toString(),width);
				}else{
					$(parentEl).css({
						"width":width+"px"
					});
				}
			}
		})
	}
	
	showOtherElement=(exceptIdx)=>{
		for(let i=0;i<exceptIdx;i++){
				var el=document.createElement("div");
				$(el).attr('id',"_expandChild"+i);
				$(el).css({
					"width":this.originWidth+"px",
					"height":this.originHeight+"px",
					"display":"inline-block",
					"position":"absolute",
					"left":(-1)*this.originWidth*(exceptIdx-i),
					"top":0,
					"background-image": "url("+this.imgLinks[i]+")",
					"background-size":"cover"
				});
				
				this.container.append($(el));
				
				$(el).on("mousedown",(event)=>{
					this.dragBeginMouseX=event.originalEvent.screenX;
					this.dragBeginMouseY=event.originalEvent.screenY;
				})
				
				$(el).on("mouseup",(event)=>{
					//slide誤差判斷
					if(Math.abs(event.originalEvent.screenX-this.dragBeginMouseX)<20)return;
					
					if(event.originalEvent.screenX-this.dragBeginMouseX>0)this.slide("next");
					else this.slide("prev");
				})
				
			
		}
		
		for(let i=exceptIdx+1;i<this.length;i++){
				var el=document.createElement("div");
				$(el).attr('id',"_expandChild"+i);
				$(el).css({
					"width":this.originWidth+"px",
					"height":this.originHeight+"px",
					"display":"inline-block",
					"position":"absolute",
					"left":this.originWidth*(i-exceptIdx),
					"top":0,
					"background-image": "url("+this.imgLinks[i]+")",
					"background-size":"cover"
				});
				this.container.append($(el));		
				$(el).on("mousedown",(event)=>{
					this.dragBeginMouseX=event.originalEvent.screenX;
					this.dragBeginMouseY=event.originalEvent.screenY;
				})
				
				$(el).on("mouseup",(event)=>{
					//slide誤差判斷
					if(Math.abs(event.originalEvent.screenX-this.dragBeginMouseX)<20)return;
					
					if(event.originalEvent.screenX-this.dragBeginMouseX>0)this.slide("next");
					else this.slide("prev");
				})
		}
	}
	
	slide = (direction) => {
			if(direction=="next"){
				//往左滑
				if(this.currentSlidePage-1<0)return;
				this.currentSlidePage-=1;
				this.changeIndicatorCircleColor(this.currentSlidePage);
				for(let i=0;i<this.length;i++){
					let nid="#_expandChild"+i;
					$(nid).animate({
					"left":"+="+this.originWidth
					});
				}
			}else{
				//往右滑
				if(this.currentSlidePage+1>=this.length)return;
				this.currentSlidePage+=1;
				this.changeIndicatorCircleColor(this.currentSlidePage);
				for(let i=0;i<this.length;i++){
					let nid="#_expandChild"+i;
					$(nid).animate({
					"left":"-="+this.originWidth
					});
				}
			}
	};
	changeIndicatorCircleColor=(idx)=>{
		//idx為當前被選擇的inedx,將idx的color轉成白色(被選擇),其他則轉為灰色(沒被選擇
		for(let i=0;i<this.length;i++){
				if(idx!=i){
					$("#_indicatorCircle"+i).css({
						"opacity":0.2
					});
				}else{
					$("#_indicatorCircle"+i).css({
						"opacity":0.7
					})
				}
		}
	}
	createSlidingIndicator=(initIdx)=>{
		let el=document.createElement("div");
		let barWidth=this.originWidth*0.2;
		let barHeight=30;
		let marginBottom=this.originHeight*0.1;

		//預設寬度為container的10%
		$(el).css({
			"width":barWidth+"px",
			"height":barHeight+"px",
			"position":"absolute",
			"bottom":marginBottom+"px",
			"left":(this.originWidth/2)-(barWidth/2)+"px"
		});
		this.container.append(el);
		

		
		// let circleWidth=(barWidth-(marginBase*this.length))/this.length;
		// let circleHeight=barHeight*0.9;
		let circleWidth=10;
		let circleHeight=10;
		let horizontalMargin=(barWidth-(circleWidth*this.length))/(this.length+1);
		let verticalMargin=barHeight/2-(circleHeight/2);
		for(let i=0;i<this.length;i++){
				let circle=document.createElement("span");
				$(circle).css({
					"width":circleWidth+"px",
					"height":circleHeight+"px",
					"border-radius":"50%",
					"background-color":"white",
					"display":"inline-block",
					"margin-left":horizontalMargin+"px",
					"margin-top":verticalMargin+"px",
					"opacity":initIdx==i?0.7:0.2
				});
				$(circle).attr("id","_indicatorCircle"+i);
				$(el).append(circle);
		}
	}
	
	createSlideArrow=()=>{
			//right arrow
			let arrowLength=18;
			let borderWidth=3;
			let circleR=30;
			let offset=(circleR/2)-(arrowLength/2)-(arrowLength/6);
			let outCircleRight=document.createElement("div");
			let littleMarginOnLeftRight=3;
			$(outCircleRight).css({
				"width":circleR+"px",
				"height":circleR+"px",
				"border-radius":"50%",
				"background-color":"white",
				"position":"absolute",
				"top":this.originHeight/2-(circleR/2)+"px",
				"right":0+"px",
				"transform": "rotate(-45deg)",
				"transform-origin":"center center",
				"opacity":0.7
			});
			this.container.append(outCircleRight);
			let el=document.createElement("i");
			$(el).css({
					"border": "solid rgb(194,194,195)",
					"border-right-width":borderWidth+"px",
					"border-bottom-width":borderWidth+"px",
					"border-top-width":0,
					"border-left-width":0,
					"display": "inline-block",
					"padding": "0px",
					"width":(arrowLength-borderWidth)+"px",
					"height":(arrowLength-borderWidth)+"px",
					"position":"absolute",
					"top":offset+"px",
					"left":offset+"px",
					"opacity":1,
			});
			$(outCircleRight).append(el);
			$(outCircleRight).click(()=>{this.slide("prev")});
			
			let outCircleLeft=document.createElement("div");
			$(outCircleLeft).css({
				"width":circleR+"px",
				"height":circleR+"px",
				"border-radius":"50%",
				"background-color":"white",
				"position":"absolute",
				"top":this.originHeight/2-(circleR/2)+"px",
				"left":littleMarginOnLeftRight+"px",
				"transform": "rotate(135deg)",
				"transform-origin":"center center",
				"opacity":0.7
			});
			this.container.append(outCircleLeft);
			let el2=document.createElement("i");
			$(el2).css({
					"border": "solid rgb(194,194,195)",
					"border-right-width":borderWidth+"px",
					"border-bottom-width":borderWidth+"px",
					"border-top-width":0,
					"border-left-width":0,
					"display": "inline-block",
					"padding": "0px",
					"width":(arrowLength-borderWidth)+"px",
					"height":(arrowLength-borderWidth)+"px",
					"position":"absolute",
					"top":offset+"px",
					"left":offset+"px",
					"opacity":1
			});
			$(outCircleLeft).append(el2);
			$(outCircleLeft).click(()=>{this.slide("next")});
	}
	
}
