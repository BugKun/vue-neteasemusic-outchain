<script>
    export default {
        name: 'ListItem',
        props: {
            index:{
                type: Number,
                required: true
            },
            musicInfo: {
                type: Object,
                default: () => {}
            },
            pop: {
                type: String,
                required: true
            },
            isPlaying:{
                type: Boolean,
                default: false
            },
            disabled:{
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                copyright: "由于版权保护，您所在的地区暂时无法使用。"
            }
        },
        computed:{
            listItemState(){
                let itemClass = [];
                if(this.isPlaying) itemClass.push("playing");
                if(this.disabled) itemClass.push("disabled");
                return itemClass.join(" ");
            },
            musicInfoName(){
                return `${ this.musicInfo.name }${ this.disabled ? `(${ this.copyright })` : ""}`
            }
        }
    }
</script>

<template src="./template.html" />
<style lang="less" scoped src="./style.less" />
