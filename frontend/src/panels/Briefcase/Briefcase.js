import React from 'react'
import './Briefcase.css'
import BriefcaseItem from "../../components/BriefcaseItem/BriefcaseItem";
import Navbar from "../../components/Navbar/Navbar";

class Briefcase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    componentDidMount() {
        this.props.getBriefcase().then(data => {
            this.setState({
                data: data.data
            })
        })
    }

    render() {
        return <Navbar links={this.props.links} logOut={this.props.logOut} getTotalPrice={this.props.getTotalPrice}>
            <div>
                <div style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: '#1e6d87',
                    fontSize: '1.8em',
                    padding: '40px'
                }}>
                    Портфель
                </div>
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: '50px'}}>
                    <table className={'briefcase-actions-table'}>
                        <tr style={{textAlign: 'center', fontWeight: 'bold', fontSize: '0.9em'}}>
                            <td colSpan={2}>
                                Код
                            </td>
                            <td>
                                Название
                            </td>
                            <td>
                                Тип
                            </td>
                            <td>
                                Количество
                            </td>
                            <td>
                                Куплено за
                            </td>
                            <td>
                                Последняя цена
                            </td>
                            <td>
                                Последнее изменение
                            </td>
                        </tr>
                        {
                            this.state.data && this.state.data.map(item => <BriefcaseItem
                                item={item}
                                getMyHistory={this.props.getMyHistory}
                            />)
                        }
                    </table>
                </div>
            </div>
        </Navbar>
    }
}

export default Briefcase;