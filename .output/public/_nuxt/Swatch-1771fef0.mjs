import{_ as n,c as r,d as t,n as c,t as i,o}from"./entry-58ba788d.mjs";const d={name:"Swatch",props:["swatchData","screenSize","index"],computed:{styleObject(){let e=null,s=null;return this.screenSize=="large"?e=this.index%5+this.index%5*3:this.screenSize=="small"&&(this.index<5?e+=this.index*2+1:(e=(this.index-5)*2,this.index>10&&(s="100%"))),{order:e,flexBasis:s}},colorStyle(){return{backgroundColor:this.swatchData.hex}}}},h={class:"copy"};function _(e,s,a,u,x,l){return o(),r("div",{class:"swatch",style:c(l.styleObject)},[t("div",{class:"color",style:c(l.colorStyle)},null,4),t("div",h,[t("h4",null,i(a.swatchData.label),1),t("p",null,i(a.swatchData.hex),1)])],4)}var y=n(d,[["render",_],["__scopeId","data-v-6f6779ac"]]);export{y as default};
