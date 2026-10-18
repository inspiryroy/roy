import math
FEE=2000; CARD=0.025; PP=0.0198; NS=0.0098; SP=0.0035; CHK=1500*45/3600
M = {
 '小餐馆': dict(gmv=1.5e6, ticket=3000, s=0.003, usdc=0.5, acct=1500, refund=0.005, rc=300, red=165, gas=20, unatt=False, gm=0.65),
 '景区店': dict(gmv=5e6, ticket=8000, s=0.01, usdc=0.8, acct=2500, refund=0.02, rc=300, red=165, gas=30, unatt=False, gm=0.35),
 '无人机台': dict(gmv=3e5, ticket=300, s=0.002, usdc=0.5, acct=300, refund=0.01, rc=5, red=0, gas=10, unatt=True, gm=0.40),
}
def calc(m, s=None):
    s = m['s'] if s is None else s
    S=m['gmv']*s; n=S/m['ticket']
    d=dict(S=S,n=n,card=S*CARD,pp=S*PP,ns=S*NS,fee=FEE,spread=S*m['usdc']*SP,red=m['red'] if S else 0,gas=m['gas'] if S else 0,
           acct=m['acct'] if S else 0, chk=0 if m['unatt'] else n*CHK, ref=n*m['refund']*m['rc'],
           fx=S*m['usdc']*0.10*math.sqrt(15/365), cap=S*0.015*15/365)
    d['hard']=d['fee']+d['spread']+d['red']+d['gas']
    d['all']=d['hard']+d['acct']+d['chk']+d['ref']
    return d
for k,m in M.items():
    d=calc(m)
    print(k, {x:round(y) for x,y in d.items()}, 'eff take', round(FEE/d['S']*100,1) if d['S'] else None, 'fee bill total', round(m['gmv']*0.0234))
    for inc in [0.1,0.3]:
        print('  incremental', inc, 'GP', round(d['S']*inc*m['gm']))
# share grid: net vs card / vs PP / vs NS, hard and all
print()
for k,m in M.items():
    for s in [0.001,0.003,0.005,0.01,0.02,0.03,0.05]:
        d=calc(m,s)
        print(k, '%.1f%%'%(s*100), round(d['S']), 'n=%.1f'%d['n'], 'hard: vsCard %d vsPP %d vsNS %d | all: vsCard %d vsPP %d vsNS %d'%(d['card']-d['hard'], d['pp']-d['hard'], d['ns']-d['hard'], d['card']-d['all'], d['pp']-d['all'], d['ns']-d['all']), 'take %.1f%%'%(FEE/d['S']*100))
