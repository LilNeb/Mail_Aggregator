<template>
    <!-- Submit and Clear Bar -->
    <div class="submit-clear-bar">
        <!-- Clear Action -->
        <div class="clear-action" @click="clearSelection">
            CLEAR
        </div>
        <!-- Submit Action -->
        <div class="submit-action" @click="submitSelection">
            SUBMIT
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        clearSelection() {
            // Emit an event to the parent component when the clear button is clicked
            this.$emit('clear-categories');
        },
        submitSelection() {
            // Emit an event to the parent component when the submit button is clicked
            this.$emit('submit-categories');
        }
    }
};
</script>

<style scoped>
/* Submit and Clear Bar Styles */
.submit-clear-bar {
    display: flex;
    width: 100%;
    background-color: #f0f0f0;
}

.submit-action,
.clear-action {
    flex: 1;
    padding: 20px;
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: #898989;
    color: white;
}

.submit-action:hover {
    background-color: #907f9a;
}

.clear-action:hover {
    background-color: #ba8181;
}
</style>
