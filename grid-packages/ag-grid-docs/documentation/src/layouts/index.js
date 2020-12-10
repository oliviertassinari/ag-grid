import React from 'react';
import { navigate } from 'gatsby';
import { GlobalContextProvider } from '../components/GlobalContext';
import FrameworkSelector from '../components/FrameworkSelector';
import HeaderNav from '../components/HeaderNav';
import Menu from '../components/Menu';
import Footer from '../components/footer/Footer';
import { getPageName } from '../utils/get-page-name';
import styles from './index.module.scss';

export const Layout = ({ path, children, pageContext: { frameworks, framework, layout } }) => {
    if (path === '/') {
        navigate('/javascript/', { replace: true });
        return null;
    }

    if (layout === 'bare') {
        return children;
    }

    const pageName = getPageName(path);

    return <GlobalContextProvider>
        <div className={styles['main-container']}>
            <header className={styles['header']}>
                {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
                <a href="/" aria-label="Home" className={styles['header__logo']}></a>
                <HeaderNav />
                <FrameworkSelector frameworks={frameworks} path={path} currentFramework={framework} />
            </header>
            <div className={styles['content-viewport']}>
                {framework && <aside className={`${styles['main-menu']} aside_menu`}>
                    <Menu currentFramework={framework} currentPage={pageName} />
                </aside>}
                <main className={styles['content']}>
                    {children}
                </main>
            </div>
            <Footer framework={framework} />
        </div>
    </GlobalContextProvider>;
};

export default Layout;