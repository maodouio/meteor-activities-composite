Template.activitiesIndex.helpers({
	activitiesIndex: function () {
		return ActivitiesIndex;
	},
	buttonOptions: function () {
    return {
      placeholder: "查看更多...",
      class: "form-control"
    }
  },
	inputOptions: function () {
    return {
      placeholder: "搜索文章...",
      id: "search"
    }
  }
});