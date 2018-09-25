<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />


<script>
    import ListItem from "./ListItem/index.vue";
    import CurrentPointer from "./CurrentPointer/index.vue";

    export default {
        name: 'PlayList',
        components:{
            ListItem,
            CurrentPointer
        },
        props: {
            musicInfoTracks: {
                type: Array,
                default: () => []
            },
            playingIndex: {
                type:Number,
                default: 0
            }
        },
        mounted() {
            this.$emit('getListBox', this.$refs.box);
        },
        data() {
            return {
                popIconSource: require('libs/icons/pop.svg'),
                popIcons: []
            }
        },
        watch:{
            musicInfoTracks:{
                handler(curVal){
                    for(let i in this.popIcons){
                        if(this.popIcons[i] instanceof Object) this.popIcons[i].url = null;
                    }
                },
                deep: true
            }
        },
        methods: {
            loadMusic(i){
                this.$emit('loadMusic', i);
            },
            pop(Num){
                const popIconContianer = document.createElement("div");

                popIconContianer.innerHTML = this.popIconSource;

                const popIconEL = popIconContianer.querySelector("svg"),
                    AllSteps = popIconEL.querySelectorAll("g> path"),
                    stepsLength = Math.ceil(Num / 100 * AllSteps.length),
                    steps = stepsLength -1;

                if(this.popIcons[steps] && this.popIcons[steps] instanceof Object) {
                    if(this.popIcons[steps].url){
                        return this.popIcons[steps].url;
                    }else{
                        const svgUrl = URL.createObjectURL(this.popIcons[steps].blob);
                        this.popIcons[steps].url = svgUrl;
                        return svgUrl;
                    }
                }else {
                    for(let i = 0; i< stepsLength; i++){
                        AllSteps[i].setAttribute("fill", "#e12828");
                    }
                    const svgBlob = new Blob([popIconContianer.innerHTML], {type: "image/svg+xml"});
                    const svgUrl = URL.createObjectURL(svgBlob);
                    this.popIcons[steps] = {
                        blob: svgBlob,
                        url: svgUrl
                    };
                    return svgUrl;
                }
            }
        }
    }
</script>
