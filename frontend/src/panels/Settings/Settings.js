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
            isRight: true,
            uploadComponents: [
                {
                    title: "Загрузка файла сбербанк \"Сделки\"",
                    name: 'sber_deals'
                },
                {
                    title: "Загрузка файла сбербанк \"Заявки\"",
                    name: 'sber_applications'
                }
            ],
            files: {
                sber_deals: null,
                sber_applications: null
            },
            filesInfo: {
                sber_deals: '',
                sber_applications: ''
            },
            filesRight: {
                sber_deals: true,
                sber_applications: true
            }
        }
    }

    handleFileUploadChange = (e) => {
        const file = e.target.files[0];
        const files = this.state.files;
        const filesInfo = this.state.filesInfo;
        const filesRight = this.state.filesRight;
        files[e.target.name] = file
        filesInfo[e.target.name] = ''
        filesRight[e.target.name] = true
        this.setState({
            files: files,
            filesInfo: filesInfo,
            filesRight: filesRight
        })

    }

    onFileUpload = (event) => {
        const name = event.target.getAttribute('name')
        const filesInfo = this.state.filesInfo;
        const filesRight = this.state.filesRight;
        if (this.state.files[name]) {
            this.props.fileUpload(this.state.files[name],
                name).then(data => {
                filesInfo[name] = 'Успешно загружено ✔'
                filesRight[name] = true
                this.setState({
                    filesInfo: filesInfo,
                    filesRight: filesRight
                })
            }).catch(e => {
                filesInfo[name] = 'Ошибка при чтении файла'
                filesRight[name] = false
                this.setState({
                    filesInfo: filesInfo,
                    filesRight: filesRight
                })
            })
        }
    }

    removeFile = (name) => {
        const files = this.state.files
        files[name] = null
        this.setState({
            files: files
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
                {this.state.uploadComponents.map(item => <div style={{paddingTop: '50px'}}>
                    <div style={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1e6d87',
                        fontSize: '1.2em',
                        padding: '20px'
                    }}>
                        {item.title}
                    </div>
                    <div>
                        <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '20px'}}>
                            <label className={'button'}>
                                <input className={'file-button'} type="file"
                                       style={{display: "none"}}
                                       value={''}
                                       name={item.name}
                                       onChange={this.handleFileUploadChange}/>
                                Прикрепить файл
                            </label>
                        </div>
                        {this.state.files[item.name] &&
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {this.state.files[item.name].name} <span
                            style={{
                                color: '#D84529',
                                fontSize: '1.8em',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                paddingLeft: '10px',
                                paddingBottom: '3px'
                            }}
                            onClick={() => this.removeFile(item.name)}>
                        x
                        </span>
                        </div>
                        }
                        {this.state.files[item.name] &&
                        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}>
                            <Button style={{backgroundColor: '#2F7747', color: '#c5dce3', border: 'none'}}
                                    onClick={this.onFileUpload} name={item.name}>
                                Сохранить
                            </Button>
                        </div>
                        }
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            paddingTop: '20px',
                            fontSize: '1.1em',
                            color: this.state.filesRight[item.name] ? '#1E9E4A' : '#D84529'
                        }}>
                            {this.state.filesInfo[item.name]}
                        </div>
                    </div>
                </div>)}
            </div>
        </Navbar>
    }
}

export default Settings;