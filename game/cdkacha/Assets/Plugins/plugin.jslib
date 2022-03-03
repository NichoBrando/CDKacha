mergeInto(LibraryManager.library, {
    StartPullRequest: function () {
        window.dispatchReactUnityEvent(
            "StartPullRequest"
        )
    }
})