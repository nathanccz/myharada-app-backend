module.exports = {
  clearCheckMarks: (grid) => {
    const clearedGrid = { ...grid }

    clearedGrid.grids.forEach((pillar, outerInd) => {
      pillar.forEach((task, innerInd) => {
        const currentCell = clearedGrid.grids[outerInd][innerInd]
        if (currentCell.status === 'complete' || currentCell.completedAt) {
          clearedGrid.grids[outerInd][innerInd].completedAt = ''
          clearedGrid.grids[outerInd][innerInd].status = ''
        }
      })
    })

    return clearedGrid.grids
  },
}
