import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from unit import unit
print('---- unit re-run with churn 4% base')
print('counter HaaS', unit(churn=0.04))
print('counter SALE', unit(churn=0.04, hw_sale_price=29800))
print('machine HaaS churn2%', unit(hw=35000, install=15000, cac=10000, churn=0.02, billing=20, support=300, sim=400, tx=2, warranty_rate=0.06))
print('machine SALE churn2%', unit(hw=35000, hw_sale_price=39800, install=15000, cac=10000, churn=0.02, billing=20, support=300, sim=400, tx=2, warranty_rate=0.06))
print('software-only churn 4/6/8%', [unit(hw=0, ship=0, install=2000, cac=10000, mdm=0, warranty_rate=0, churn=c) for c in (0.04,0.06,0.08)])
for p in [980,2000,3000,5000]:
    print('price',p,[ (c, unit(price=p, churn=c)['payE'], unit(price=p, churn=c)['cumE60'], unit(price=p,churn=c)['pay_surv']) for c in [0.02,0.04,0.06]])
for h in [15000,25000,40000]:
    print('hw',h,[ (c, unit(hw=h, churn=c)['pay_surv'], unit(hw=h, churn=c)['cumE60']) for c in [0.02,0.04,0.06]])
for cac in [5000,15000,30000,50000]:
    print('cac',cac,[ (c, unit(cac=cac, churn=c)['payE'], unit(cac=cac, churn=c)['pay_surv'], unit(cac=cac, churn=c)['cumE60']) for c in [0.02,0.04,0.06]])

def fleet(name, new, price, churn, cac, hw, gmv_t, fixed, legal=5_000_000, extra_rev=0, extra_var=0, months=36,
          install=8000, ship=1500, mdm=150, warranty=0.05, support=400):
    u = unit(price=price+extra_rev, hw=hw, cac=cac, churn=churn, install=install, ship=ship, mdm=mdm, warranty_rate=warranty, support=support+extra_var)
    var = u['var']; upfront = u['upfront']
    active=0.0; cum_pre=0.0; cum=0.0-legal; peak=cum; first_pos=None; rows=[]
    for t in range(1,months+1):
        survivors = active*(1-churn)
        billed = survivors + new*0.5
        active = survivors + new
        rev_sub = billed*price; rev_extra=billed*extra_rev
        contrib = billed*(price+extra_rev-var)
        cf = contrib - new*upfront
        cum_pre += cf
        cum += cf - fixed
        peak = min(peak, cum)
        if first_pos is None and (contrib - new*upfront - fixed)>=0: first_pos=t
        if t in (12,24,36): rows.append((t, round(active), round(rev_sub+rev_extra), round(contrib), round(active*gmv_t)))
    return dict(name=name, unit=u, rows=rows, cum_pre=round(cum_pre), cum=round(cum), peak=round(peak), first_pos=first_pos,
                be_active=round(fixed/(price+extra_rev-var)) if price+extra_rev-var>0 else None,
                take_rate_36=(rows[-1][2]/rows[-1][4] if rows[-1][4] else None), steady=round(new/churn))

S = [
 fleet('下行', new=10, price=2000, churn=0.06, cac=40000, hw=30000, gmv_t=3000, fixed=1_500_000),
 fleet('基准', new=30, price=2000, churn=0.04, cac=30000, hw=25000, gmv_t=15000, fixed=2_000_000),
 fleet('上行(仅稳定币)', new=80, price=2000, churn=0.02, cac=15000, hw=20000, gmv_t=60000, fixed=2_500_000),
 fleet('结构替代A:纯软件层', new=60, price=2000, churn=0.05, cac=10000, hw=0, gmv_t=15000, fixed=2_000_000, install=2000, ship=0, mdm=0, warranty=0),
 fleet('结构替代B:多通道捆绑', new=50, price=2000, churn=0.02, cac=30000, hw=25000, gmv_t=15000, fixed=3_000_000, extra_rev=1500, extra_var=300),
]
for s in S:
    print(s)
