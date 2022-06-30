import { ReactComponent as DrumSetSvg } from '../../assets/drumset.svg';

const MobileHeader = () => {
    return (
        <div className="mobile-header">
            <h1 className="mobile-header-title title">    
            Dr<span className="primary-color">U</span>m<br/> Mach<span className="primary-color">I</span>ne
            </h1>
            <DrumSetSvg className="mobile-header-svg" style={{maxWidth: '100%'}} />
            <div className="mobile-header-background"></div>
        </div>
    );
};

export default MobileHeader;