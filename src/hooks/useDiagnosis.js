import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "./useAuth";
import { useAlert } from "./useAlert";
import { useScores } from "@/contexts/ScoreProvider";


export const useDiagnosis = () => {

    const { user } = useAuth();
    const { setScores } = useScores();
    const { showAlert } = useAlert();
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
   

    const fetchSubjects = async () => {
        const { data, error } = await supabase
            .from('subjects')
            .select('*');
        if (error) {
            showAlert('Não foi possível carregar as matérias!', 'fail');
        } else {
            setSubjects(data);
        }
    }

    const fetchTopics = async (subjectId) => {
        const { data, error } = await supabase
            .from('topics')
            .select('id, name')
            .eq('subject_id', subjectId)
            
        if (error) {
            showAlert('Não foi possível carregar os tópicos!', 'fail');
        } else {
            setTopics(data);
        }
    }

    const fetchSubtopics = async (topicId) => {
        const { data, error } = await supabase
            .from('subtopics')
            .select('*')
            .eq('topic_id', topicId);
        if (error) {
            showAlert('Não foi possível carregar os sub-tópicos!', 'fail');
        } else {
            setSubtopics(data);
        }
    }

    const fetchQuestions = async (subtopicId) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('subtopic_id', subtopicId)
            .range(0, 4);

        if (error) {
            showAlert('Não foi possível carregar as questões!', 'fail');
        } else {
            setQuestions(data);
        }
        setLoading(false);
    }

    const saveScore = async (subtopic_id, score) => {  
        
        const { error } = await supabase
            .from('user_subtopic_scores')
            .insert([
                { subtopic_id: subtopic_id, score: score, user_id: user.id}
            ])
            .select();

        if (error) {
            showAlert('Erro ao salvar diagnóstico!', 'error');
            return;
        } 

        showAlert('Diagnóstico salvo!', 'success');
        fetchScores();
    }

    const saveQuestionsAnswers = async (answers) => {
        const { error } = await supabase
            .from('user_subtopic_answers')
            .insert(answers);

        if (error) {
            showAlert('Erro ao salvar respostas!', 'error');
            return;
        }

        showAlert('Respostas salvas!', 'success');
    }
            

    const fetchScores = async () => {
        const { data, error } = await supabase
            .from('user_subtopic_scores')
            .select(`*, 
                subtopics (
                    name
                )`)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            showAlert('Erro ao carregar diagnósticos!', 'error');
        } else {
            setScores(data);
        }
    }


    useEffect(() => {
        fetchSubjects();
        fetchScores();
    }, []);

    return {
        subjects,
        topics,
        subtopics,
        questions,
        loading,
        fetchTopics,
        fetchSubtopics,
        fetchQuestions,
        saveScore,
        saveQuestionsAnswers,
    };


};


