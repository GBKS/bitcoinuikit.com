import{_ as i,b as v,c as s,F as _,r as f,o as t,a as k,w as h,g as b,t as o,i as n,f as l}from"./entry-58ba788d.mjs";const m={name:"Tabs",props:["items","activeId"],methods:{click(r){this.$emit("select",r)}}},p={class:"tabs"},y=["href"],x=["onClick"];function C(r,I,c,g,B,u){const d=v("router-link");return t(),s("div",p,[(t(!0),s(_,null,f(c.items,(e,a)=>(t(),s(_,{key:a},[e.to?(t(),k(d,{key:0,class:n(a==c.activeId?"-active":null),to:e.to},{default:h(()=>[b(o(e.label),1)]),_:2},1032,["class","to"])):l("",!0),e.href?(t(),s("a",{key:1,class:n(a==c.activeId?"-active":null),href:e.href},o(e.label),11,y)):l("",!0),!e.to&&!e.href?(t(),s("button",{key:2,class:n(a==c.activeId?"-active":null),onClick:T=>u.click(a)},o(e.label),11,x)):l("",!0)],64))),128))])}var F=i(m,[["render",C],["__scopeId","data-v-4175de2a"]]);export{F as default};
