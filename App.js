import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
    // 1. Add todo
    // Input 창에서 엔터키를 누르면 Todo가 추가
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');
    // console.log('todos', todos);

    // ******************************************
    // TextInput 의 onChangeText={setText} 부분
    // const changeText = (text) => {
    // setText(text)
    // }

    // ===

    // setText
    // ******************************************

    // 2. Set Category
    // category: JavaScript, React, CodingTest
    const [category, setCategory] = useState('');
    // console.log('category', category);
    const [editText, setEditText] = useState('');
    // console.log('editText', editText);
    const newTodo = {
        id: Date.now(),
        text,
        isDone: false,
        isEdit: false,
        category,
    };
    const addTodo = () => {
        setTodos((prev) => [...prev, newTodo]);
        setText(''); // 엔터키 눌러 Todo가 추가되면 인풋을 빈 문자열로 전환
    };
    const setDone = (id) => {
        // 3. Set Done
        // 완료 토글링
        // 3-1. id를 매개변수로 받는다
        // 3-2. id에 해당하는 배열의 요소를 찾는다
        // 3-3. 그 배열의 요소의 isDone 값을 토글링한 후에 setTodos
        const newTodos = [...todos];
        const idx = newTodos.findIndex((todo) => todo.id === id);
        newTodos[idx].isDone = !newTodos[idx].isDone;
        setTodos(newTodos);
    };
    const setEdit = (id) => {
        // 5. Edit Task. 3. setDone과 로직은 같다.
        // 수정 토글링
        // 5-1. id를 매개변수로 받는다
        // 5-2. id에 해당하는 배열의 요소를 찾는다
        // 5-3. 그 배열의 요소의 isEdit 값을 토글링한 후에 setTodos
        // 5.4. UI 에 함수 적용 후 변경할 내용 useState 로 생성해 줘야함
        const newTodos = [...todos];
        const idx = newTodos.findIndex((todo) => todo.id === id);
        newTodos[idx].isEdit = !newTodos[idx].isEdit;
        setTodos(newTodos);
    };
    const editTodo = (id) => {
        // 5.~ 의 setEdit 과정 끝난 후 enter 입력 시 todo 를 edit 하는 과정
        // 5.~ 1. id 값을 매개변수로 받아서 해당 배열의 요소를 찾는다. idx 찾기
        // 5.~ 2. todos[idx].text = editText;
        const newTodos = [...todos];
        const idx = newTodos.findIndex((todo) => todo.id === id);
        newTodos[idx].text = editText;
        newTodos[idx].isEdit = false;
        setTodos(newTodos);
    };
    const deleteTodo = (id) => {
        // Alert API 사용
        Alert.alert('Todo 삭제', '정말 삭제하시겠습니까?', [
            {
                // 좌클릭
                text: '취소',
                style: 'cancel',
                onPress: () => console.log('취소 클릭!'),
            },
            {
                // 우클릭
                text: '삭제',
                style: 'destructive',
                onPress: () => {
                    // 4. Delete Todo
                    // 삭제 이모티콘 터치 시 해당 todo 삭제
                    // 4-1. id 값을 받아서 해당 배열 요소를 제외한 나머지를 새로운 배열로 받는다
                    // 4-2. 새로운 배열로 setTodos
                    // 얕은 복사 하지 않고 바로 tods 쓰는 이유 : filter method 는 immutable. todos 에 영향을 미치지 못함
                    const newTodos = todos.filter((todo) => todo.id !== id);
                    setTodos(newTodos);
                },
            },
        ]);
    };

    // 6.~~~~~~~~~~~~~~~~~~
    const setCat = async (cat) => {
        console.log('cat:', cat);
        setCategory(cat);
        await AsyncStorage.setItem('category', cat);
    };

    useEffect(() => {
        // npm install @react-native-async-storage/async-storage 명령어로 AsyncStorage import 후 과정임
        // 6. 현재의 최신 todos 를 AsyncStorage 에 저장
        const saveTodos = async () => {
            await AsyncStorage.setItem('todos', JSON.stringify(todos));
        };
        if (todos.length > 0) saveTodos();
    }, [todos]);

    useEffect(() => {
        const getData = async () => {
            const resp_todos = await AsyncStorage.getItem('todos'); // todos 배열
            const resp_cat = await AsyncStorage.getItem('category'); // undefined / null

            setTodos(JSON.parse(resp_todos) ?? []);
            setCategory(resp_cat ?? 'js');
        };
        getData();
    }, []);

    return (
        <SafeAreaView style={styles.safearea}>
            {/* SafeAreaView: 없으면 노치가 있는 휴대폰에 UI가 겹침. 자동
    계산을 해서 디바이스 특징을 인식해 패딩을 준 것임. 패딩 등 css
    속성이 적용되지 않음. 안드로이드만을 개발할 것이라면 없어도 괜찮음. */}
            <StatusBar style="auto" />
            <View style={styles.container}>
                <View style={styles.tabs}>
                    <TouchableOpacity
                        onPress={() => setCat('JavaScript')}
                        style={{
                            ...styles.tab,
                            backgroundColor:
                                category === 'JavaScript' ? '#4287f5' : 'grey',
                        }}
                    >
                        {/* TouchableOpacity: 클릭 시 포커스 효과 */}
                        <Text style={styles.tabText}>Javascript</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setCat('React')}
                        style={{
                            ...styles.tab,
                            backgroundColor:
                                category === 'React' ? '#4287f5' : 'grey',
                        }}
                    >
                        <Text style={styles.tabText}>React</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setCat('Coding Test')}
                        style={{
                            ...styles.tab,
                            backgroundColor:
                                category === 'Coding Test' ? '#4287f5' : 'grey',
                        }}
                    >
                        <Text style={styles.tabText}>Coding Test</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.inputWrapper}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        onSubmitEditing={addTodo}
                        placeholder="Enter your task"
                        style={styles.input}
                    />
                </View>
                <ScrollView>
                    {/* .filter((todo) => todo.category === category)
            if문 대신 filter 를 써도 같음.
            tmi. JS 배열 중 map, filter, reduce, forEach 등은 모든 []의 요소를 순회할 때까지 멈추지 않음. filter => map 을 돌리면 더 반복할 수 밖에 없음.
            그래서 map 안에 if 문을 돌리는게 성능적으로 좋다. */}
                    {todos.map((todo) => {
                        if (todo.category === category) {
                            return (
                                <View style={styles.task} key={todo.id}>
                                    {todo.isEdit ? (
                                        <TextInput
                                            value={editText}
                                            onChangeText={setEditText}
                                            onSubmitEditing={() =>
                                                editTodo(todo.id)
                                            }
                                            style={{
                                                backgroundColor: 'white',
                                                flex: 1,
                                            }}
                                        />
                                    ) : (
                                        <Text
                                            style={{
                                                textDecorationLine: todo.isDone
                                                    ? 'line-through'
                                                    : 'none',
                                            }}
                                        >
                                            {todo.text}
                                        </Text>
                                    )}

                                    <View style={{ flexDirection: 'row' }}>
                                        <TouchableOpacity
                                            onPress={() => setDone(todo.id)}
                                        >
                                            <AntDesign
                                                name="checksquare"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => setEdit(todo.id)}
                                        >
                                            <Feather
                                                style={{ marginLeft: 10 }}
                                                name="edit"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => deleteTodo(todo.id)}
                                        >
                                            <AntDesign
                                                style={{ marginLeft: 10 }}
                                                name="delete"
                                                size={24}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safearea: {
        flex: 1, // flex: 1 모든 화면을 stretch 해주는 역할.
    },
    container: {
        flex: 1,
        paddingVertical: 30,
        paddingHorizontal: 20,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tab: {
        backgroundColor: '#4287f5',
        paddingHorizontal: 10,
        paddingVertical: 15,
        width: '30%',
        alignItems: 'center',
    },
    tabText: {
        fontWeight: '700',
    },
    inputWrapper: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 15,
        marginTop: 15,
        marginBottom: 15,
    },
    input: {
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    task: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: '#D9D9D9',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
});
