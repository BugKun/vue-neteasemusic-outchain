<template>
    <div class="list">
        <ul class="box" ref="box">
            <li v-for="(li,i) in musicInfoTracks" @click="playMusic(i)" :style="playingStatus(i)" :title="(li.disabled)? copyright : ''">
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
            this.$emit('getListBox',this.$refs.box);
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
            playMusic(i){
                this.$emit('playMusic',i);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list {
        border-top: 1px solid #e6e6e6;
        transition: all .6s ease;
        flex: 1;
        overflow: auto;
        ul.box {
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
            height: auto;
            li {
                display: flex;
                padding: 0;
                margin: 0;
                height: 30px;
                min-height: 30px;
                position: relative;
                line-height: 30px;
                float: left;
                list-style: none;
                cursor: default;
                .cur {
                    width: 3px;
                    height: 22px;
                    position: absolute;
                    left: 0;
                    top: 4px;
                    display: none;
                    background: #df2d2d;
                }
                .index {
                    width: 40px;
                    text-align: center;
                    color: #999;
                }
                .name {
                    margin-right: 1em;
                }
                .by {
                    flex: 1;
                    color: #666;
                    text-align: right;
                }
            }
            li:nth-child(odd) {
                background: #f7f7f7;
            }
        }
    }
    .list::-webkit-scrollbar {
        width: 8px;
        height: 8px;
        border-radius: 8px;
    }
    .list::-webkit-scrollbar-thumb {
        border-radius: 8px;
        background: #757575;
    }
    .list::-webkit-scrollbar-button {
        display: none;
    }
    .f-thide {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
    }
</style>
