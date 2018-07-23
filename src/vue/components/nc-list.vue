<template>
    <div class="list">
        <div class="cur" :style="Number.isInteger(playingIndex)? `transform: translateY(${30 * playingIndex}px)` : `transform: translateY(-30px)`"></div>
        <ul class="box" ref="box">
            <li v-for="(li,i) in musicInfoTracks"
                @click="loadMusic(i)"
                :style="playingStatus(i)"
                :title="li.disabled? copyright : null">
                <div class="index">{{ i + 1 }}</div>
                <div class="name f-thide" :title="li.disabled? copyright : li.name">{{ li.name }}{{ li.disabled? `(${copyright})` : "" }}</div>
                <div class="pop"
                     v-if="typeof li.pop === 'number'"
                     :title="`热度：${li.pop}`">
                    <svg width="20" height="20">
                        <image :xlink:href="pop(li.pop)" width="20" height="20"/>
                    </svg>
                </div>
                <div class="by f-thide"
                     :title="li.disabled? copyright : li.artists"
                     :style="li.disabled? 'color: #bbb' : null">{{ li.artists }}</div>
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
                default: () => []
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
                popIconSource: require('libs/icons/pop.svg'),
                popIcons: []
            }
        },
        watch:{
            musicInfoTracks:{
                handler(){
                    this.popIcons = []
                },
                deep: true
            }
        },
        methods: {
            playingStatus(i){
                let style = i === this.playingIndex? 'background: #e9e9e9;' : '';
                if(this.musicInfoTracks && this.musicInfoTracks[i].disabled) style += "color: #bbb !important;";
                return style;
            },
            loadMusic(i){
                this.$emit('loadMusic', i);
            },
            pop(Num){
                const popIconContianer = document.createElement("div");

                popIconContianer.innerHTML = this.popIconSource;

                const popIconEL = popIconContianer.querySelector("svg"),
                    AllSteps = popIconEL.querySelectorAll("g> path"),
                    steps = Math.ceil(Num / 100 * AllSteps.length);

                if(this.popIcons[steps-1]) {
                    return this.popIcons[steps-1];
                }else {
                    for(let i = 0; i< steps; i++){
                        AllSteps[i].setAttribute("fill", "#e12828");
                    }
                    const svgBlob = new Blob([popIconContianer.innerHTML], {type: "image/svg+xml"});
                    const svgUrl = URL.createObjectURL(svgBlob);
                    this.popIcons[steps-1] = svgUrl;
                    return svgUrl;
                }
            }
        }
    }
</script>

<style lang="scss" src="./nc-list.scss" scoped></style>
