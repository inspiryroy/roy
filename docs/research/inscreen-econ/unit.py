import math, itertools
H_MONTHS=60

def unit(price=2000, hw=25000, hw_sale_price=0, ship=1500, install=8000, cac=30000, churn=0.03,
         billing=80, support=400, mdm=150, sim=0, infra=100, tx=3, gas_per_tx=1.0, screen_per_tx=0.0,
         warranty_rate=0.05, free_months=0, deprec_m=36, horizon=H_MONTHS):
    var = billing+support+mdm+sim+infra+tx*gas_per_tx+tx*screen_per_tx+warranty_rate*hw/12
    contrib = price-var
    upfront = hw+ship+install+cac-hw_sale_price
    # per surviving terminal cumulative cash
    cum=-upfront; pay_surv=None
    cumE=-upfront; payE=None; S=1.0
    for t in range(1,horizon+1):
        rev = 0 if t<=free_months else price
        c = rev-var
        cum += c
        if pay_surv is None and cum>=0: pay_surv=t
        cumE += S*c
        if payE is None and cumE>=0: payE=t
        S *= (1-churn)
    ltv_inf = None
    return dict(var=round(var), contrib=round(contrib), upfront=round(upfront), pay_surv=pay_surv, payE=payE,
                cumE60=round(cumE), deprec=round(hw/deprec_m), pl_contrib_after_dep=round(contrib-hw/deprec_m),
                ltv60=round(cumE+upfront))

base_counter = dict()
base_machine = dict(hw=35000, install=15000, cac=10000, churn=0.015, billing=20, support=300, sim=400, tx=2, warranty_rate=0.06)

print('BASE counter HaaS', unit(**base_counter))
print('BASE counter SALE @29,800', unit(hw_sale_price=29800))
print('BASE counter 2 free months', unit(free_months=2))
print('BASE machine HaaS', unit(**base_machine))
print('BASE machine SALE @39,800', unit(**base_machine, hw_sale_price=39800))
print('counter paid KYT alloc 230/mo (1000 terminals)', unit(mdm=150+230))
print('counter paid KYT alloc 1150/mo (200 terminals)', unit(mdm=150+1150))
print()
print('Price sensitivity (counter HaaS)')
for p in [980,2000,3000,5000]:
    print(p, unit(price=p), '| machine', unit(price=p, **base_machine))
print('HW sensitivity')
for h in [15000,25000,40000]:
    print(h, unit(hw=h))
print('Churn sensitivity')
for c in [0.015,0.03,0.05]:
    print(c, unit(churn=c))
print('CAC sensitivity')
for c in [5000,15000,30000,50000]:
    print(c, unit(cac=c))
print('Software-only (merchant own device): hw=0 ship=0 install=2000 cac=10000 mdm=0 warranty 0')
print(unit(hw=0, ship=0, install=2000, cac=10000, mdm=0, warranty_rate=0))
print(unit(hw=0, ship=0, install=2000, cac=5000, mdm=0, warranty_rate=0, churn=0.03))
print('Grid price x churn (counter HaaS, CAC 30k, hw 25k): payE')
for p in [980,2000,3000,5000]:
    print(p, [ (c, unit(price=p, churn=c)['payE'], unit(price=p, churn=c)['cumE60']) for c in [0.015,0.03,0.05]])
print('Grid price x CAC (churn 3%)')
for p in [980,2000,3000,5000]:
    print(p, [ (c, unit(price=p, cac=c)['payE'], unit(price=p,cac=c)['pay_surv']) for c in [5000,15000,30000]])
# alternative pricing at base GMV per terminal
for gmv in [4500, 15000, 50000]:
    print('GMV',gmv, {r: round(gmv*r) for r in [0.005,0.0098,0.01]})
# bundle: multi-payment rev share
for share_bps in [5,10,20,30]:
    for gmv in [1_500_000, 5_000_000]:
        print('bundle', share_bps, gmv, round(gmv*share_bps/10000))
