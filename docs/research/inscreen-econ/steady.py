sc = {
 '下行': dict(contrib=1142, churn=0.06, upfront=79500, fixed=1.5e6, new=10),
 '基准': dict(contrib=1163, churn=0.04, upfront=64500, fixed=2.0e6, new=30),
 '上行(仅稳定币)': dict(contrib=1184, churn=0.02, upfront=44500, fixed=2.5e6, new=80),
 '软件层': dict(contrib=1417, churn=0.05, upfront=12000, fixed=2.0e6, new=60),
 '多通道捆绑': dict(contrib=2363, churn=0.02, upfront=64500, fixed=3.0e6, new=50),
}
for k,v in sc.items():
    ltv = v['contrib']/v['churn']; surplus = ltv - v['upfront']
    steady_cf = v['new']*surplus - v['fixed']
    be_new = v['fixed']/surplus if surplus>0 else None
    # simulate 120 months
    a=0; cum=-5e6; firstpos=None; cumpos=None; peak=cum
    for t in range(1,121):
        s=a*(1-v['churn']); billed=s+v['new']*0.5; a=s+v['new']
        cf=billed*v['contrib']-v['new']*v['upfront']-v['fixed']; cum+=cf; peak=min(peak,cum)
        if firstpos is None and cf>=0: firstpos=t
        if cumpos is None and cum>=0: cumpos=t
    print(k, 'LTV(无限期,无折现)=%d'%ltv, 'surplus=%d'%surplus, 'steadyCF=%d'%steady_cf, 'be_new/mo=%s'%(round(be_new) if be_new else None), 'firstposCF=%s'%firstpos, 'cumpos=%s'%cumpos, 'peak120=%d'%peak)
