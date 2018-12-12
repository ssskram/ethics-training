import * as React from 'react'

// props for pagination:
// https://stackoverflow.com/questions/40232847/how-to-implement-pagination-in-reactjs

const paddingLeft = {
    paddingLeft: '25px'
}

const paddingRight = {
    paddingRight: '25px'
}

export default class Paging extends React.Component<any, any> {
    constructor(props) {
        super(props);
    }

    public render() {
        const {
            currentPage,
            totalPages,
            prev,
            next,
            count
        } = this.props

        return (
            <div>
                {count.length > 30 &&
                    <div>
                        {(currentPage - 1 == 0) && (totalPages.includes(currentPage + 1)) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={prev.bind(this)} disabled><span style={paddingRight} className='glyphicon glyphicon-arrow-left'></span>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={next.bind(this)}>Next<span style={paddingLeft} className='glyphicon glyphicon-arrow-right'></span></button>
                                    </div>
                                </div>
                            </div>
                        }
                        {(currentPage - 1 > 0) && (totalPages.includes(currentPage + 1)) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={prev.bind(this)}><span style={paddingRight} className='glyphicon glyphicon-arrow-left'></span>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={next.bind(this)}>Next<span style={paddingLeft} className='glyphicon glyphicon-arrow-right'></span></button>
                                    </div>
                                </div>
                            </div>
                        }
                        {!totalPages.includes(currentPage + 1) &&
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={prev.bind(this)}><span style={paddingRight} className='glyphicon glyphicon-arrow-left'></span>Previous</button>
                                    </div>
                                    <div className='col-sm-6 text-center'>
                                        <button className='btn  btn-primary' onClick={next.bind(this)} disabled>Next<span style={paddingLeft} className='glyphicon glyphicon-arrow-right'></span></button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                }
            </div>
        );
    }
}

