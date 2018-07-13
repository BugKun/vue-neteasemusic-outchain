<template>
    <div class="list">
        <ul class="box" ref="box">
            <li v-for="(li,i) in musicInfoTracks" @click="loadMusic(i)" :style="playingStatus(i)" :title="(li.disabled)? copyright : null">
                <div class="cur" :style="(i === playingIndex)? 'display: block;' : ''"></div>
                <div class="index">{{ i + 1 }}</div>
                <div class="name f-thide" :title="(li.disabled)? copyright : li.name">{{ li.name }}{{ (li.disabled)? "(" + copyright + ")" : "" }}</div>
                <div class="by f-thide" :title="(li.disabled)? copyright : li.artists" :style="(li.disabled)? 'color: #bbb' : ''">{{ li.artists }}</div>
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
                copyright: "由于版权保护，您所在的地区暂时无法使用。"
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
            }
        }
    }
</script>

<style lang="scss" src="./nc-list.scss" scoped></style>
