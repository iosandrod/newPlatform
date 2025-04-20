export const sum = (records: any[], field: string) => {
  let sum = 0
  for (let i = 0; i < records.length; i++) {
    let _v = Number(records[i][field])
    if (isNaN(_v)) {
      continue
    }
    sum += _v
  }
  return sum //
}

export const calObj = {
  sum,
}
