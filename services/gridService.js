module.exports = {
  clearCheckMarks: (grid) => {
    const clearedGrid = { ...grid }

    clearedGrid.grids.forEach((pillar, outerInd) => {
      pillar.forEach((task, innerInd) => {
        clearedGrid.grids[outerInd][innerInd].completedAt = ''
      })
    })

    return clearedGrid.grids
  },
}
