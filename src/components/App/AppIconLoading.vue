<template>
    <g>
        <line x1="12" y1="2" x2="12" y2="6"></line>
        <line x1="12" y1="18" x2="12" y2="22"></line>
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
        <line x1="2" y1="12" x2="6" y2="12"></line>
        <line x1="18" y1="12" x2="22" y2="12"></line>
        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        <animateTransform 
         attributeName="transform" 
         attributeType="XML" 
         type="rotate"
         dur="1s" 
         from="0 12 12"
         :to="animationControl" 
         repeatCount="indefinite" />
    </g>
</template>
<script>
export default {
    props: {
        isAnimating: {
            type: Boolean,
            default: false 
        }
    },
    computed: {
        animationControl() {
            return this.isAnimating ? '180 12 12' : '0 12 12'; 
        }
    },
}
</script>

