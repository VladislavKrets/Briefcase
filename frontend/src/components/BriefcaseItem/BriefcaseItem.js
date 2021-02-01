import React from 'react'
import './BriefcaseItem.css'

class BriefcaseItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    getMyHistory = (financialCode) => {
        this.props.getMyHistory(financialCode).then(data => {
            this.setState({
                data: data.data
            })
        })
    }

    render() {
        const item = this.props.item
        return <>
            <tr
                onClick={() => this.state.data
                    ? this.setState({data: null})
                    : this.getMyHistory(item.financial_code)}
                style={{cursor: 'pointer'}}
            >
                <td style={{
                    textAlign: 'center',
                    fontSize: '1.4em',
                    fontWeight: 'bold',
                    padding: '0 15px',
                    borderRight: 'none'
                }}>
                    {this.state.data ? "-" : "+"}
                </td>
                <td style={{borderLeft: 'none'}}>
                    {item.financial_code}
                </td>
                <td>
                    {item.price_info.secname}
                </td>
                <td>
                    {item.financial_type}
                </td>
                <td>
                    {item.count}
                </td>
                <td>
                    {item.price_one}
                </td>
                <td>
                    {item.price_info.last_price}
                </td>
                <td>
                    {item.price_info.last_change}
                </td>
            </tr>
            {this.state.data ? <tr>
                <td colSpan={8} className={'briefcase-item-history-row'}>
                    <div>
                        <table className={'briefcase-item-table'}>
                            <tr style={{textAlign: 'center', fontWeight: 'bold'}}>
                                <td>Номер сделки</td>
                                <td>Операция</td>
                                <td>Цена</td>
                                <td>Количество</td>
                                <td>Дата заключения</td>
                            </tr>
                            {
                                this.state.data.map(x => <tr>
                                        <td>{x.deal_number}</td>
                                        <td>{x.operation}</td>
                                        <td>{x.price}</td>
                                        <td>{x.count}</td>
                                        <td>{('' + x.conclusion_date)
                                            .replace('T', ' ')
                                            .replace('Z', '')}
                                        </td>
                                    </tr>
                                )
                            }
                        </table>
                    </div>
                </td>
            </tr> : null}
        </>
    }
}

export default BriefcaseItem;