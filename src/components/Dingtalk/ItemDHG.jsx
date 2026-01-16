import './Dingtalk.scss';

const ItemDHG = (props) => {
    return (
        <div className='app-container-about'>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <h1>Báo cáo Google Looker Studio</h1>
                <a
                    href="https://lookerstudio.google.com/reporting/bfa9c15c-f35c-4d6c-805a-4d8bd1951de8"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '5px'
                    }}
                >
                    Mở báo cáo
                </a>
            </div>
        </div>
    );
}

export default ItemDHG;
