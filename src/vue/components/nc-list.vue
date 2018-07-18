<template>
    <div class="list">
        <ul class="box" ref="box">
            <li v-for="(li,i) in musicInfoTracks" @click="loadMusic(i)" :style="playingStatus(i)" :title="(li.disabled)? copyright : null">
                <div class="cur" :style="(i === playingIndex)? 'display: block;' : null"></div>
                <div class="index">{{ i + 1 }}</div>
                <div class="name f-thide" :title="(li.disabled)? copyright : li.name">{{ li.name }}{{ (li.disabled)? `(${copyright})` : "" }}</div>
                <div class="pop" v-if="typeof li.pop === 'number'"><img :src="pop(li.pop)" class="hot" :title="`热度：${li.pop}`"/></div>
                <div class="by f-thide" :title="(li.disabled)? copyright : li.artists" :style="(li.disabled)? 'color: #bbb' : null">{{ li.artists }}</div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: 'nc-list',
        props: {
            musicInfoTracks: {
                type: Array,
                default: () => {
                    return []
                }
            },
            playingIndex: {
                required: true
            }
        },
        mounted() {
            this.$emit('getListBox', this.$refs.box);
        },
        data() {
            return {
                copyright: "由于版权保护，您所在的地区暂时无法使用。",
                popIcons:[]
            }
        },
        methods: {
            playingStatus(i){
                let style = (i === this.playingIndex)? 'background: #e9e9e9;' : '';
                if(this.musicInfoTracks && this.musicInfoTracks[i].disabled) style += "color: #bbb !important;";
                return style;
            },
            loadMusic(i){
                this.$emit('loadMusic', i);
            },
            pop(Num){
                const popIcon = require('libs/icons/pop.svg'),
                    popIconContianer = document.createElement("div");

                popIconContianer.innerHTML = popIcon;

                const popIconEL = popIconContianer.querySelector("svg"),
                    AllSteps = popIconEL.querySelectorAll("g> path"),
                    steps = Math.ceil(Num / 100 * AllSteps.length);

                if(this.popIcons[steps-1]) {
                    return this.popIcons[steps-1]
                }else {
                    for(let i = 0; i< steps; i++){
                        AllSteps[i].setAttribute("fill", "#e12828");
                    }
                    const svgBlob = new Blob([popIconContianer.innerHTML], {type: "image/svg+xml;charset=utf-8"});
                    const svgUrl = URL.createObjectURL(svgBlob);
                    this.popIcons[steps-1] = svgUrl;
                    return svgUrl;
                }
            }
        }
    }
</script>

<style lang="scss" src="./nc-list.scss" scoped></style>
