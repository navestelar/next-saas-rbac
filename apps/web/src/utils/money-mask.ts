export function moneyMask(money: number) {
  return money.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}
