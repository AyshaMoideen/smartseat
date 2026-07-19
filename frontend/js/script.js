/*======================================
FEATURES SECTION
======================================*/

.features{

    padding:100px 0;
    background:#ffffff;

}

.section-title{

    text-align:center;
    margin-bottom:60px;

}

.section-title h2{

    font-family:'Montserrat',sans-serif;
    font-size:42px;
    font-weight:800;
    color:var(--primary);
    margin-bottom:15px;

}

.section-title p{

    max-width:700px;
    margin:auto;
    color:var(--gray);
    font-size:18px;
    line-height:1.8;

}

.feature-card{

    background:#fff;
    border-radius:22px;
    padding:35px;
    text-align:center;
    box-shadow:var(--shadow);
    transition:.35s;
    height:100%;

}

.feature-card:hover{

    transform:translateY(-10px);
    box-shadow:0 20px 45px rgba(0,0,0,.12);

}

.feature-card i{

    font-size:52px;
    color:var(--secondary);
    margin-bottom:20px;

}

.feature-card h4{

    font-weight:700;
    color:var(--primary);
    margin-bottom:15px;

}

.feature-card p{

    color:var(--gray);
    line-height:1.8;

}

/*======================================
ABOUT SECTION
======================================*/

.about{

    padding:100px 0;
    background:var(--light);

}

.about-logo{

    width:300px;
    display:block;
    margin:auto;
    filter:drop-shadow(0 10px 25px rgba(0,0,0,.15));

}

.about h2{

    font-family:'Montserrat',sans-serif;
    font-size:40px;
    color:var(--primary);
    margin-bottom:25px;

}

.about p{

    font-size:18px;
    line-height:1.9;
    color:#555;
    margin-bottom:20px;

}

/*======================================
FOOTER
======================================*/

footer{

    background:var(--primary);
    color:#fff;
    padding:60px 0;

}

.footer-logo{

    width:80px;
    margin-bottom:20px;

}

footer h5{

    font-weight:700;
    margin-bottom:15px;

}

footer p{

    color:#dbeafe;
    margin-bottom:8px;

}

/*======================================
CUSTOM SCROLLBAR
======================================*/

::-webkit-scrollbar{

    width:10px;

}

::-webkit-scrollbar-track{

    background:#edf2f7;

}

::-webkit-scrollbar-thumb{

    background:var(--secondary);
    border-radius:20px;

}

::-webkit-scrollbar-thumb:hover{

    background:var(--primary);

}

/*======================================
SMOOTH FADE
======================================*/

.fade-up{

    animation:fadeUp .8s ease forwards;

}

@keyframes fadeUp{

    from{

        opacity:0;
        transform:translateY(40px);

    }

    to{

        opacity:1;
        transform:translateY(0);

    }

}

/*======================================
RESPONSIVE
======================================*/

@media(max-width:1200px){

.hero-title{

    font-size:52px;

}

}

@media(max-width:992px){

.hero{

    text-align:center;

}

.hero-title{

    font-size:46px;

}

.hero-text{

    margin:auto;

}

.hero-buttons{

    justify-content:center;

}

.dashboard-preview{

    margin-top:60px;

}

.about{

    text-align:center;

}

.about-logo{

    margin-bottom:40px;

}

}

@media(max-width:768px){

.logo{

    width:52px;
    height:52px;

}

.college-name{

    font-size:15px;

}

.college-sub{

    display:none;

}

.hero{

    padding-top:130px;

}

.hero-title{

    font-size:38px;

}

.hero-text{

    font-size:16px;

}

.preview-body{

    grid-template-columns:1fr;

}

.section-title h2{

    font-size:34px;

}

.feature-card{

    padding:28px;

}

.about h2{

    font-size:34px;

}

.about-logo{

    width:220px;

}

}

@media(max-width:576px){

.hero-title{

    font-size:32px;

}

.btn-primary,
.btn-outline-primary{

    width:100%;

}

.dashboard-preview{

    padding:20px;

}

.preview-card{

    padding:20px;

}

}