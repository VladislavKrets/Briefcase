import React from 'react'
import Button from "../../components/Button/Button";
import './Settings.css'
import Navbar from "../../components/Navbar/Navbar";

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            textInfo: '',
            isRight: true
        }
    }

    handleFileUploadChange = (e) => {
        const file = e.target.files[0];
        this.setState({
            file: file,
            textInfo: '',
            isRight: true
        })

    }

    onFileUpload = () => {
        if (this.state.file) {
            this.props.fileUpload(this.state.file).then(data => {
                this.setState({
                    textInfo: 'Успешно загружено ✔',
                    isRight: true
                })
            }).catch(e => {
                this.setState({
                    textInfo: 'Ошибка при чтении файла',
                    isRight: false
                })
            })
        }
    }

    removeFile = () => {
        this.setState({
            file: null
        })
    }

    render() {
        return <Navbar links={this.props.links} logOut={this.props.logOut}>
            <div>
                <div style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#1e6d87',
                    fontSize: '1.8em',
                    padding: '40px'
                }}>
                    Настройки
                </div>
                <div style={{paddingTop: '50px'}}>
                    <div style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1e6d87',
                        fontSize: '1.2em',
                        padding: '20px'
                    }}>
                        Загрузка файла "Сделки"
                    </div>
                    <div>
                        <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '20px'}}>
                            <label className={'button'}>
                                <input className={'file-button'} type="file"
                                       style={{display: "none"}}
                                       value={''}
                                       onChange={this.handleFileUploadChange}/>
                                Прикрепить файл
                            </label>
                        </div>
                        {this.state.file &&
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {this.state.file.name} <span
                            style={{
                                color: '#D84529',
                                fontSize: '1.8em',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                paddingLeft: '10px',
                                paddingBottom: '3px'
                            }}
                            onClick={this.removeFile}>
                        x
                        </span>
                        </div>
                        }
                        {this.state.file &&
                        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
                            <Button style={{backgroundColor: '#2F7747', color: '#c5dce3', border: 'none'}}
                                    onClick={this.onFileUpload}>
                                Сохранить
                            </Button>
                        </div>
                        }
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '20px',
                            fontSize: '1.1em',
                            color: this.state.isRight ? '#1E9E4A' : '#D84529'
                        }}>
                            {this.state.textInfo}
                        </div>
                    </div>
                </div>
            </div>
        </Navbar>
    }
}

export default Settings;