const Filter = (props) => {
  return (
      <div>
        filter shown with <input
          value={props.newFilter}
          onChange={props.handleNewFilter}
      />
      </div>
  )
}

export default Filter