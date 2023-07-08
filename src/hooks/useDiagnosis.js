import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useAuth } from "./useAuth";
import { useAlert } from "./useAlert";
// import { unique } from "next/dist/build/utils";
import { useRouter } from "next/router";
import { useScores } from "@/contexts/ScoreProvider";


export const useDiagnosis = () => {

    const { user } = useAuth();
    const { scores, setScores } = useScores();
    const { showAlert } = useAlert();
    const router = useRouter();
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [subtopics, setSubtopics] = useState([]);
    const [questions, setQuestions] = useState([]);
    // const [scores, setScores] = useState([]);
    // const [userId, setUserId] = useState(null);

    const fetchSubjects = async () => {
        const { data, error } = await supabase
            .from('subjects')
            .select('*');
        if (error) {
            console.log(error);
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
            console.log(error);
        } else {
            setTopics(data);
            console.log(data);
        }
    }

    const fetchSubtopics = async (topicId) => {
        const { data, error } = await supabase
            .from('subtopics')
            .select('*')
            .eq('topic_id', topicId);
        if (error) {
            console.log(error);
        } else {
            setSubtopics(data);
            console.log(data);
        }
    }

    const fetchQuestions = async (subtopicId) => {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('subtopic_id', subtopicId)
            .range(0, 4);

        if (error) {
            console.log(error);
        } else {
            setQuestions(data);
            console.log(data);
        }
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
            console.log(error);
            return;
        } 

        showAlert('Diagnóstico salvo!', 'success');
        fetchScores();
    }

    const fetchScores = async () => {
        const { data, error } = await supabase
            .from('user_subtopic_scores')
            .select(`*, 
                subtopics (
                    name
                )`)
            .eq('user_id', user.id)
            // .join('subtopics', { 'subtopics.id': 'user_subtopic_scores.subtopic_id' })
            .order('created_at', { ascending: false });

        if (error) {
            console.log(error);
        } else {
            setScores(data);
            // console.log(data);
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
        // scores,
        fetchTopics,
        fetchSubtopics,
        fetchQuestions,
        // fetchScores,
        saveScore,
    };


};


