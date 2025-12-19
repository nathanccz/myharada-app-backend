const mergeToNewGridTemplate = (result, template) => {
  const mergedGrid = { ...template }

  mergedGrid.title = result.title
  mergedGrid.description = result.description + '.'

  mergedGrid.grids[4][4].text = result.title

  result.subGoals.forEach((subGoal, index) => {
    let outerIndex = index

    if (index >= 4) {
      outerIndex = index + 1
    }

    mergedGrid.grids[4][outerIndex].text = subGoal.subGoal

    subGoal.tasks.forEach((task, index) => {
      let innerIndex = index

      if (index === 4) {
        mergedGrid.grids[outerIndex][4].text = subGoal.subGoal
      }

      if (index >= 4) {
        innerIndex = index + 1
      }

      mergedGrid.grids[outerIndex][innerIndex].text = task
    })
  })

  return mergedGrid
}

module.exports = { mergeToNewGridTemplate: mergeToNewGridTemplate }
