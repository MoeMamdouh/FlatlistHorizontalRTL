import React from 'react';
import {View, Text, Dimensions, I18nManager} from 'react-native';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
I18nManager.forceRTL(true);

let containerCount = 0;

class CellContainer extends React.Component {
  constructor(args) {
    super(args);
    this._containerId = containerCount++;
  }
  render() {
    return (
      <View {...this.props}>
        {this.props.children}
        <Text>Cell Id: {this._containerId}</Text>
      </View>
    );
  }
}

/***
 * To test out just copy this component and render in you root component
 */
export default class RecycleTestComponent extends React.Component {
  constructor(args) {
    super(args);

    //Create the data provider and provide method which takes in two rows of data and return if those two are different or not.
    let dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    //Create the layout provider
    //First method: Given an index return the type of item e.g ListItemType1, ListItemType2 in case you have variety of items in your list/grid
    //Second: Given a type and object set the height and width for that type on given object
    //If you need data based check you can access your data provider here
    //You'll need data in most cases, we don't provide it by default to enable things like data virtualization in the future
    //NOTE: For complex lists LayoutProvider will also be complex it would then make sense to move it to a different file

    this._layoutProvider = new LayoutProvider(
      (index) => {
        return index;
      },
      (type, dimension) => {
        dimension.height = 120;
        dimension.width = 120;
      },
    );

    this._rowRenderer = this._rowRenderer.bind(this);

    //Since component should always render once data has changed, make data provider part of the state
    this.state = {
      dataProvider: dataProvider.cloneWithRows(this._generateArray(200)),
    };
  }

  _generateArray(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
      arr[i] = i;
    }
    return arr;
  }

  //Given type and data return the view component
  _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    console.log('item');
    return (
      <CellContainer style={styles.container}>
        <Text>Data: {data}</Text>
      </CellContainer>
    );
  }

  render() {
    return (
      <View style={{height: 200, backgroundColor: 'red'}}>
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={this.state.dataProvider}
          rowRenderer={this._rowRenderer}
          isHorizontal
        />
      </View>
    );
  }
}
const styles = {
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#00a1f1',
    width: 100,
    height: 100,
    margin: 10,
  },
};
