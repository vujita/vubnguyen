"use strict";(self.webpackChunkvujita_ui=self.webpackChunkvujita_ui||[]).push([[492],{"./stories/avatar.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{PlaceholderAvatar:()=>PlaceholderAvatar,ProfileAvatar:()=>ProfileAvatar,__namedExportsOrder:()=>__namedExportsOrder,default:()=>avatar_stories});var react=__webpack_require__("../../node_modules/react/index.js"),dist=__webpack_require__("../../node_modules/class-variance-authority/dist/index.mjs"),clsx=__webpack_require__("../../node_modules/clsx/dist/clsx.mjs"),tw_merge=__webpack_require__("../../node_modules/tailwind-merge/dist/lib/tw-merge.mjs");const classnames=function cn(...inputs){return(0,tw_merge.m)((0,clsx.W)(inputs))};var jsx_runtime=__webpack_require__("../../node_modules/react/jsx-runtime.js");const placeHolderVariants=(0,dist.j)("overflow-clip text-center select-none",{variants:{size:{lg:["text-lg"],md:["text-sm"],sm:["text-sm"],xlg:["text-lg"],xs:["text-xs"]}}}),avatarVariants=(0,dist.j)("relative flex items-center justify-center overflow-hidden border-width-2",{defaultVariants:{backgroundColor:"gray",border:!1,shape:"rounded",size:"sm"},variants:{backgroundColor:{gray:"bg-gray-300 dark:bg-gray-600"},border:{false:[],true:[]},shape:{rounded:"rounded-full",square:""},size:{lg:["h-24 w-24"],md:["h-16 w-16"],sm:["h-12 w-12"],xlg:["h-32 w-32"],xs:["h-8 w-8"]}}}),Avatar=(0,react.forwardRef)(((props,ref)=>{const{border=!1,backgroundColor,imgClassName,imgProps,size,shape,src,placeholder,...divProps}=props,divClassNames=avatarVariants({backgroundColor,border,shape,size}),[showPlaceholder,setShowPlaceholder]=(0,react.useState)(!src);return(0,react.useEffect)((()=>{setShowPlaceholder(!src)}),[src]),(0,jsx_runtime.jsxs)("div",{...divProps,className:divClassNames,ref,children:[src?(0,jsx_runtime.jsx)("img",{"aria-label":"Avatar photo",...imgProps,className:classnames(["h-full w-full object-cover"],imgClassName),onError:()=>{setShowPlaceholder(!0)},onLoad:()=>{setShowPlaceholder(!1)},src}):null,showPlaceholder?(0,jsx_runtime.jsx)("div",{className:placeHolderVariants({size}),children:placeholder}):null]})}));Avatar.displayName="Avatar";try{avatarVariants.displayName="Avatar",avatarVariants.__docgenInfo={description:"",displayName:"Avatar",props:{backgroundColor:{defaultValue:null,description:"",name:"backgroundColor",required:!1,type:{name:'"gray" | null'}},border:{defaultValue:null,description:"",name:"border",required:!1,type:{name:"boolean | null"}},shape:{defaultValue:null,description:"",name:"shape",required:!1,type:{name:'"rounded" | "square" | null'}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:'"sm" | "lg" | "md" | "xlg" | "xs" | null'}},class:{defaultValue:null,description:"",name:"class",required:!1,type:{name:"ClassValue"}},className:{defaultValue:null,description:"",name:"className",required:!1,type:{name:"ClassValue"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/avatar.tsx#Avatar"]={docgenInfo:Avatar.__docgenInfo,name:"Avatar",path:"src/avatar.tsx#Avatar"})}catch(__react_docgen_typescript_loader_error){}const avatar_stories={argTypes:{backgroundColor:{control:"radio",defaultValue:"gray",description:"background color",options:["gray"]},border:{control:"boolean",defaultValue:!1,description:"border"},className:{control:"text",defaultValue:"",description:"extra classnames"},imgClassName:{control:"text",defaultValue:"",description:"extra classnames"},placeholder:{control:"text",defaultValue:"N/A",description:"placeholder when image is missing"},shape:{control:"radio",defaultValue:"rounded",options:["rounded","square"]},size:{control:"radio",defaultValue:"xs",options:["xs","sm","md","lg"]},src:{control:"text"}},component:Avatar,parameters:{layout:"centered"},tags:["autodocs"],title:"Example/Avatar"},PlaceholderAvatar={args:{backgroundColor:"gray",border:!1,placeholder:"N/A",shape:"rounded",size:"xs"}},ProfileAvatar={args:{backgroundColor:"gray",border:!1,placeholder:"N/A",shape:"rounded",size:"sm",src:"https://cdn.discordapp.com/avatars/318810734685454336/2d4cae233d57ba9ab0e3deec9c2600d6.png"}};PlaceholderAvatar.parameters={...PlaceholderAvatar.parameters,docs:{...PlaceholderAvatar.parameters?.docs,source:{originalSource:'{\n  args: {\n    backgroundColor: "gray",\n    border: false,\n    placeholder: "N/A",\n    shape: "rounded",\n    size: "xs"\n  }\n}',...PlaceholderAvatar.parameters?.docs?.source}}},ProfileAvatar.parameters={...ProfileAvatar.parameters,docs:{...ProfileAvatar.parameters?.docs,source:{originalSource:'{\n  args: {\n    backgroundColor: "gray",\n    border: false,\n    placeholder: "N/A",\n    shape: "rounded",\n    size: "sm",\n    src: "https://cdn.discordapp.com/avatars/318810734685454336/2d4cae233d57ba9ab0e3deec9c2600d6.png"\n  }\n}',...ProfileAvatar.parameters?.docs?.source}}};const __namedExportsOrder=["PlaceholderAvatar","ProfileAvatar"]}}]);