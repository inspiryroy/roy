# INSCREEN economics model (all JPY, 税別 unless noted). Every input is an assumption unless marked FACT.
import math, json, os

# ---------- Part 1: merchant ----------
FEE = 2000           # 假设: founder's tentative monthly fee (税別)
CARD = 0.025         # FACT range 1.98%-3.24%; 2.5% = Square small-biz (has conditions)
PAYPAY = 0.0198      # FACT 税別
NETSTARS = 0.0098    # FACT 非課税
USDC_SPREAD = 0.0035 # FACT-ish: CoinPost measured SBI VC 販売所 buy spread ~0.352%; sell side assumed equal
STAFF_PER_HOUR = 1500
CHECKOUT_EXTRA_SEC = 45
CHECKOUT_COST = STAFF_PER_HOUR*CHECKOUT_EXTRA_SEC/3600  # per stablecoin txn

merchants = {
 'R': dict(name='小餐馆', gmv=1_500_000, ticket=3000, shares={'低':0.001,'基准':0.003,'高':0.02}, usdc=0.5,
           acct={'低':500,'基准':1500,'高':5000}, refund=0.005, refund_cost=300, redeem_fee=165, gas=20),
 'T': dict(name='景区店', gmv=5_000_000, ticket=8000, shares={'低':0.001,'基准':0.01,'高':0.05}, usdc=0.8,
           acct={'低':800,'基准':2500,'高':6000}, refund=0.02, refund_cost=300, redeem_fee=165, gas=30),
 'M': dict(name='无人机台', gmv=300_000, ticket=300, shares={'低':0.0,'基准':0.002,'高':0.01}, usdc=0.5,
           acct={'低':100,'基准':300,'高':1000}, refund=0.01, refund_cost=5, redeem_fee=0, gas=10),
}
# notes: redeem_fee = bank transfer / withdrawal per month (assumption ¥0-330, base 165 = midpoint); machine: operator aggregates, so per-machine ~0

def inscreen_cost(m, s, lvl, include_soft=True):
    S = m['gmv']*s
    n = S/m['ticket']
    spread = S*m['usdc']*USDC_SPREAD
    redeem = m['redeem_fee'] if S>0 else 0
    gas = m['gas'] if S>0 else 0
    acct = m['acct'][lvl] if S>0 else 0
    checkout = n*CHECKOUT_COST if m is not merchants['M'] else 0
    refund = n*m['refund']*m['refund_cost']
    hard = FEE + spread + redeem + gas
    soft = acct + checkout + refund
    fx1sigma = S*m['usdc']*0.10*math.sqrt(15/365)  # USDJPY 10% ann. vol, avg 15-day hold
    return dict(S=S, n=n, fee=FEE, spread=spread, redeem=redeem, gas=gas, acct=acct, checkout=checkout,
                refund=refund, hard=hard, total=hard+(soft if include_soft else 0), fx1s=fx1sigma)

out = {}
for k,m in merchants.items():
    out[k] = {}
    for lvl,s in m['shares'].items():
        c = inscreen_cost(m,s,lvl)
        S = c['S']
        out[k][lvl] = dict(c, card=S*CARD, paypay=S*PAYPAY, netstars=S*NETSTARS,
                           take_rate=(FEE/S if S>0 else None),
                           net_vs_card=S*CARD-c['total'], net_vs_paypay=S*PAYPAY-c['total'], net_vs_ns=S*NETSTARS-c['total'],
                           total_fee_bill=m['gmv']*0.0234)
for k in out:
    print(k, merchants[k]['name'])
    for lvl,v in out[k].items():
        print(' ',lvl, {x:(round(y,1) if isinstance(y,(int,float)) and y is not None else y) for x,y in v.items()})

# break-even GMV
print('\nBreak-even stablecoin GMV (pure fee): ', {r: round(FEE/r) for r in [0.01,0.02,0.03,0.0098,0.0198,0.025,0.0324]})
# full-cost break-even for each merchant (base level): (FEE + fixed)/(r - v)
for k,m in merchants.items():
    v_hard = m['usdc']*USDC_SPREAD
    v_soft = v_hard + (CHECKOUT_COST/m['ticket'] if k!='M' else 0) + m['refund']*m['refund_cost']/m['ticket']
    F_hard = FEE + m['redeem_fee'] + m['gas']
    F_soft = F_hard + m['acct']['基准']
    row = {}
    for r in [0.01,0.02,0.03]:
        row[r] = (round(F_hard/(r-v_hard)) if r>v_hard else None, round(F_soft/(r-v_soft)) if r>v_soft else None)
    print(k, 'v_hard=%.4f v_soft=%.4f'%(v_hard,v_soft), row, 'txns@base-hard', {r: round(row[r][0]/m['ticket'],1) for r in row}, 'soft', {r: (round(row[r][1]/m['ticket'],1) if row[r][1] else None) for r in row})

# share grid net benefit vs card 2.5% and vs PayPay 1.98% and Netstars
print('\nGrid net benefit (incl soft, base acct)')
for k,m in merchants.items():
    for s in [0.001,0.005,0.01,0.03,0.05]:
        c = inscreen_cost(m,s,'基准')
        print(k, s, round(c['S']), 'n=%.1f'%c['n'], 'vsCard', round(c['S']*CARD-c['total']), 'vsPP', round(c['S']*PAYPAY-c['total']), 'vsNS', round(c['S']*NETSTARS-c['total']), 'hardonly vsCard', round(c['S']*CARD-c['hard']))
json.dump(out, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'part1.json'),'w'), ensure_ascii=False, indent=1, default=str)
