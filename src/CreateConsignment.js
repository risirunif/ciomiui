import React from 'react'
import _ from 'lodash'

class CreateConsignment extends React.Component {
    
    // eslint-disable-next-line
    constructor (props) {
        super(props)
    }

    state = {
        created: false,
        description: '',
        weight: 0,
        containers: [],
        consignments: [],
        _mounted: false
    }

    componentDidMount () {
       this._mounted = true
    }

    componentWillUnmount () {
       this._mounted = false
    }

    componentWillMount () {
        fetch(`http://localhost:8080/rpc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service: 'shippy.consignment',
                method: 'ShippingService.GetConsignments',
                request: {}
            })
        })
        .then(req => req.json())
        .then(res => {
        	if (this._mounted) {
	            // this.setState({
	            //     consignments: res.consignments
	            // })
        	}
        })
        .catch(err => {
        	console.log(err)
        })
    }

    create () {
        const consignment = this.state

        fetch(`http://localhost:8080/rpc`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service: 'shippy.consignment',
                method: 'ShippingService.CreateConsignment',
                request: _.omit(consignment, 'created', 'consignments')
            })
        })
        .then(req => req.json())
        .then(res => {
            this.setState({
                created: res.created,
                consignments: [...this.state.consignments, consignment]
            })
        })
    } 

    addContainer = e => {
        this.setState({
            containers: [...this.state.containers, e.target.value]
        })
    }
    
    setDescription = e => {
        this.setState({
            description: e.target.value
        })
    }

    setWeight = e => {
        this.setState({
            weight: Number.parseInt(e.target.value)
        })
    }
    
    render () {
        const {consignments} = this.state
        return (
          <div className='consignment-screen'>
            <div className='consignment-form container'>
              <br />
              <div className='form-group'>
                <textarea onChange={this.setDescription} className='form-control' placeholder='Description'></textarea>
              </div>
              <div className='form-group'>
                <input onChange={this.setWeight} type='number' placeholder='Weight' className='form-control' />
              </div>
              <div className='form-control'>
                Add containers...
              </div>
              <br />
              <button onClick={this.create.bind(this)} className='btn btn-primary'>Create</button>
              <br />
              <hr />
            </div>
            {(consignments && consignments.length > 0
              ? <div className='consignment-list'>
                  <h2>Consignments</h2>
                  {consignments.map((item) => (
                    <div key={item.description}>
                      <p>Vessel id: {item.vessel_id}</p>
                      <p>Consignment id: {item.id}</p>
                      <p>Description: {item.description}</p>
                      <p>Weight: {item.weight}</p>
                      <hr />
                    </div>
                  ))}
                </div>
              : false)}
          </div>
        )
    }
}

export default CreateConsignment
