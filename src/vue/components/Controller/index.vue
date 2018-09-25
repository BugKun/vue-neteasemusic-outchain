<template src="./template.html"/>
<style lang="scss" scoped src="./style.scss" />

<script>
    export default {
        name: "Controller",
        props:{
            audio:{
                validator(value) {
                    return value instanceof Audio
                },
                required: true
            },
        }
    }
</script>
