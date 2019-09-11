import React from 'react';
import './App.css';
import { Form, FormGroup, Row, Col, Label, Input, Button } from 'reactstrap'
//import 'bootstrap/dist/css/bootstrap.css';
import GameOfLife from './Game'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      applied: null,
      form: {
        size: 30,
        hardEdge: true,
      }
    }
  }
  
  handleChange(event) {
    this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: [event.target.value]
      }
    })
  }

  handleSubmit (event) {
    if(this.state.form.size <= 0) return;
    this.setState({applied: Object.assign(this.state.form)})
  }

  render() {
    return (
      <div className="App">
        <h1>Conway's Game of Life (React Edition)</h1>
        <br/>
        { this.state.applied ? null : 
          <Form onSubmit={e => { e.preventDefault(); }} id="setupForm">
            <Row form>
              <Col md={1}>
                <Label for="sizeInput">Size</Label>
              </Col>
              <Col md={3}>
                <Input sm={2} type="number" id="sizeInput" name="size" onChange={this.handleChange.bind(this)} value={this.state.form.size} disabled={this.state.applied}/>
              </Col>
              <Col md={4}>
                <FormGroup check>
                  <Label check>
                    <Input type="checkbox" name="hardEdge" checked={this.state.hardEdge} onChange={this.handleChange.bind(this)} disabled={this.state.applied}/> Enforce wall at edges
                  </Label>
                </FormGroup>
              </Col>
              <Col md={4}>
                <Button type="button" onClick={this.handleSubmit.bind(this)} disabled={this.state.applied}>Confirm</Button>
              </Col>
            </Row>
          </Form>
        }
        <hr/>
        {this.state.applied ? <GameOfLife size={this.state.applied.size} hardEdge={this.state.applied.hardEdge}/> : null}
      </div>
    );
  }
}

export default App;
